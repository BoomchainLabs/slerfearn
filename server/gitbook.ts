import { Request, Response } from 'express';
import fetch from 'node-fetch';

interface GitBookPage {
  path: string;
  title: string;
  type: string;
  uid: string;
  description?: string;
  children?: GitBookPage[];
}

const fetchGitBookContent = async (space: string, path: string, token: string) => {
  const apiUrl = `https://api.gitbook.com/v1/spaces/${space}/content`;
  
  try {
    // First, fetch the content structure to get the content ID for the given path
    const structureResponse = await fetch(`${apiUrl}/structure`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!structureResponse.ok) {
      throw new Error(`Failed to fetch content structure: ${structureResponse.statusText}`);
    }
    
    const structure = await structureResponse.json() as { pages: GitBookPage[] };
    
    // Recursively find the page by path
    const findPageByPath = (pages: GitBookPage[], targetPath: string): GitBookPage | null => {
      for (const page of pages) {
        if (page.path === targetPath) {
          return page;
        }
        if (page.children && page.children.length > 0) {
          const found = findPageByPath(page.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    const targetPage = findPageByPath(structure.pages, path) || structure.pages[0];
    const contentId = targetPage.uid;
    
    // Now fetch the actual content
    const contentResponse = await fetch(`${apiUrl}/page/${contentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!contentResponse.ok) {
      throw new Error(`Failed to fetch page content: ${contentResponse.statusText}`);
    }
    
    const contentData = await contentResponse.json() as {
      title: string;
      description?: string;
      content: { html: string };
    };
    
    return {
      title: contentData.title,
      description: contentData.description || '',
      content: contentData.content.html || '<p>No content available</p>',
      pages: structure.pages,
      path: targetPage.path,
    };
  } catch (error) {
    console.error('Error fetching GitBook content:', error);
    throw error;
  }
};

export const handleGitBookRequest = async (req: Request, res: Response) => {
  const { space, path } = req.query;
  const gitbookToken = process.env.GITBOOK_TOKEN;
  
  if (!gitbookToken) {
    return res.status(500).json({ error: 'GitBook token is not configured' });
  }
  
  if (!space) {
    return res.status(400).json({ error: 'Space parameter is required' });
  }
  
  try {
    const content = await fetchGitBookContent(
      space as string, 
      (path as string) || '', 
      gitbookToken
    );
    
    return res.json(content);
  } catch (error: any) {
    console.error('GitBook API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch GitBook content',
      message: error.message
    });
  }
};