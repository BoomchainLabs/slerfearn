import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen, Book, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';

interface GitBookDocsProps {
  space?: string;
  defaultPage?: string;
  title?: string;
  description?: string;
}

interface GitBookContent {
  title: string;
  description: string;
  content: string;
  pages: GitBookPage[];
  path: string;
}

interface GitBookPage {
  title: string;
  path: string;
  type: string;
  uid: string;
  description?: string;
  children?: GitBookPage[];
}

const GitBookDocs: React.FC<GitBookDocsProps> = ({
  space = 'lerf-hub',
  defaultPage = 'token',
  title = '$LERF Documentation',
  description = 'Official documentation for the $LERF token ecosystem'
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<GitBookContent | null>(null);
  const [navigation, setNavigation] = useState<GitBookPage[]>([]);
  const [currentPath, setCurrentPath] = useState<string>(defaultPage);
  const [breadcrumbs, setBreadcrumbs] = useState<{title: string, path: string}[]>([]);

  // Function to fetch GitBook content
  const fetchGitBookContent = async (path: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/gitbook?space=${space}&path=${path}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GitBook content: ${response.statusText}`);
      }
      
      const data = await response.json();
      setContent(data);
      
      if (!navigation.length && data.pages) {
        setNavigation(data.pages);
      }
      
      // Update breadcrumbs
      const pathParts = path.split('/');
      const newBreadcrumbs = [];
      let currentPath = '';
      
      for (const part of pathParts) {
        if (!part) continue;
        currentPath += (currentPath ? '/' : '') + part;
        
        // Find the title for this path part by searching through navigation
        const findPageTitle = (pages: GitBookPage[], targetPath: string): string | undefined => {
          for (const page of pages) {
            if (page.path === targetPath) {
              return page.title;
            }
            if (page.children) {
              const title = findPageTitle(page.children, targetPath);
              if (title) return title;
            }
          }
          return undefined;
        };
        
        const title = findPageTitle(navigation, currentPath) || part;
        newBreadcrumbs.push({ title, path: currentPath });
      }
      
      setBreadcrumbs(newBreadcrumbs.length ? newBreadcrumbs : [{ title: 'Home', path: '' }]);
      
    } catch (error) {
      console.error('Error fetching GitBook content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documentation. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGitBookContent(currentPath);
  }, [currentPath]);

  // Function to render navigation menu recursively
  const renderNavigation = (pages: GitBookPage[], depth = 0) => {
    return pages.map((page) => (
      <div key={page.uid} className={`ml-${depth * 4}`}>
        <Button
          variant="ghost"
          className={`w-full justify-start text-left ${page.path === currentPath ? 'bg-slerf-dark-lighter text-slerf-cyan' : ''}`}
          onClick={() => setCurrentPath(page.path)}
        >
          {page.type === 'group' ? <Book className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
          <span className="truncate">{page.title}</span>
        </Button>
        {page.children && page.children.length > 0 && (
          <div className="mt-1 mb-2">
            {renderNavigation(page.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Function to sanitize and render HTML content safely
  const renderContent = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  // Navigate to sibling pages
  const navigateSibling = (direction: 'next' | 'prev') => {
    // Find the current page in the flat navigation structure
    const flattenNavigation = (pages: GitBookPage[]): GitBookPage[] => {
      return pages.reduce((acc, page) => {
        acc.push(page);
        if (page.children && page.children.length) {
          acc.push(...flattenNavigation(page.children));
        }
        return acc;
      }, [] as GitBookPage[]);
    };
    
    const allPages = flattenNavigation(navigation);
    const currentIndex = allPages.findIndex(page => page.path === currentPath);
    
    if (currentIndex > -1) {
      const targetIndex = direction === 'next' 
        ? Math.min(currentIndex + 1, allPages.length - 1)
        : Math.max(currentIndex - 1, 0);
        
      if (targetIndex !== currentIndex) {
        setCurrentPath(allPages[targetIndex].path);
      }
    }
  };

  return (
    <Card className="w-full bg-slerf-dark-light border-slerf-dark-lighter">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="md:col-span-1 bg-slerf-dark rounded-lg p-4 max-h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" /> Documentation
            </h3>
            {isLoading && !navigation.length ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {renderNavigation(navigation)}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="md:col-span-3">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center mb-4 text-sm overflow-x-auto pb-2 scrollbar-thin">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slerf-cyan"
                    onClick={() => setCurrentPath(crumb.path)}
                  >
                    {crumb.title}
                  </Button>
                </React.Fragment>
              ))}
            </div>
            
            {/* Content Display */}
            <div className="bg-slerf-dark rounded-lg p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : content ? (
                <div>
                  <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
                  {content.description && (
                    <p className="text-gray-400 mb-6">{content.description}</p>
                  )}
                  <div 
                    className="gitbook-content prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={renderContent(content.content)}
                  />
                  
                  {/* Pagination */}
                  <div className="flex justify-between mt-8 pt-4 border-t border-slerf-dark-lighter">
                    <Button 
                      variant="outline" 
                      onClick={() => navigateSibling('prev')}
                      disabled={breadcrumbs.length <= 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigateSibling('next')}
                    >
                      Next <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Documentation content not found.</p>
                </div>
              )}
            </div>
            
            {/* External Link */}
            <div className="mt-4 text-right">
              <Button 
                variant="link" 
                className="text-gray-400 text-sm"
                onClick={() => window.open(`https://${space}.gitbook.io/${currentPath}`, '_blank')}
              >
                View on GitBook <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitBookDocs;