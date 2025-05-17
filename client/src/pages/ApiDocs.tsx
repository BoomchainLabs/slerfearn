import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SiGitbook } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ApiPath {
  path: string;
  methods: {
    [key: string]: {
      summary: string;
      description: string;
      tags: string[];
    };
  };
}

export default function ApiDocs() {
  const [paths, setPaths] = useState<ApiPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<ApiPath | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOpenApiSpec = async () => {
      try {
        setLoading(true);
        const response = await fetch('/openapi/openapi.json');
        
        if (!response.ok) {
          throw new Error('Failed to load API documentation');
        }
        
        const data = await response.json();
        
        // Transform the paths data into a more usable format
        const pathsArray = Object.entries(data.paths).map(([path, methods]) => ({
          path,
          methods: methods as any,
        }));
        
        setPaths(pathsArray);
        
        // Set initial selections
        if (pathsArray.length > 0) {
          setSelectedPath(pathsArray[0]);
          const firstMethod = Object.keys(pathsArray[0].methods)[0];
          setSelectedMethod(firstMethod);
        }
      } catch (error) {
        console.error('Error loading API documentation:', error);
        toast({
          title: "Error",
          description: "Failed to load API documentation. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOpenApiSpec();
  }, [toast]);

  const handlePublishToGitBook = async () => {
    try {
      toast({
        title: "Publishing to GitBook",
        description: "Please wait while we publish the API documentation to GitBook...",
      });
      
      const response = await fetch('/api/gitbook/publish-openapi', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish to GitBook');
      }
      
      toast({
        title: "Published Successfully",
        description: "The API documentation has been published to GitBook.",
      });
    } catch (error) {
      console.error('Error publishing to GitBook:', error);
      toast({
        title: "Publication Failed",
        description: "Failed to publish the API documentation to GitBook. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const renderMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      get: "bg-blue-500",
      post: "bg-green-500",
      put: "bg-yellow-500",
      delete: "bg-red-500",
      patch: "bg-purple-500",
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-mono text-white ${colors[method] || "bg-gray-500"}`}>
        {method.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>$LERF API Documentation</CardTitle>
            <CardDescription>Loading API documentation...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse w-8 h-8 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">$LERF API Documentation</CardTitle>
              <CardDescription className="text-white/80 mt-2">
                Comprehensive API reference for building with the $LERF ecosystem
              </CardDescription>
            </div>
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={handlePublishToGitBook}
            >
              <SiGitbook className="h-4 w-4" />
              <span>Publish to GitBook</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x">
            {/* API Endpoints Sidebar */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">API Endpoints</h3>
                <Separator className="my-2" />
                
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-1">
                    {paths.map((pathItem) => (
                      <div key={pathItem.path} className="mb-2">
                        <Button
                          variant={selectedPath?.path === pathItem.path ? "default" : "ghost"}
                          className="w-full justify-start font-mono text-sm"
                          onClick={() => {
                            setSelectedPath(pathItem);
                            setSelectedMethod(Object.keys(pathItem.methods)[0]);
                          }}
                        >
                          {pathItem.path}
                        </Button>
                        
                        {selectedPath?.path === pathItem.path && (
                          <div className="ml-4 mt-1 space-y-1">
                            {Object.entries(pathItem.methods).map(([method, details]) => (
                              <Button
                                key={method}
                                size="sm"
                                variant={selectedMethod === method ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setSelectedMethod(method)}
                              >
                                <div className="flex items-center gap-2">
                                  {renderMethodBadge(method)}
                                  <span className="truncate">{details.summary}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            {/* API Method Details */}
            <div className="md:col-span-8 lg:col-span-9">
              {selectedPath && selectedMethod ? (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {renderMethodBadge(selectedMethod)}
                    <h2 className="font-mono text-lg font-semibold">{selectedPath.path}</h2>
                  </div>
                  
                  <h3 className="text-xl font-bold mt-4">
                    {selectedPath.methods[selectedMethod].summary}
                  </h3>
                  
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {selectedPath.methods[selectedMethod].description}
                  </p>
                  
                  <div className="mt-4">
                    <Tabs defaultValue="usage">
                      <TabsList>
                        <TabsTrigger value="usage">Usage</TabsTrigger>
                        <TabsTrigger value="params">Parameters</TabsTrigger>
                        <TabsTrigger value="responses">Responses</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="usage" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Example Request</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                              <code>{`curl -X ${selectedMethod.toUpperCase()} \\
  "https://api.lerfhub.xyz${selectedPath.path}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                            </pre>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="params" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Parameters</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              For detailed parameter information, please refer to the full documentation on GitBook.
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="responses" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Response Codes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-green-500">200 - OK</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  The request was successful. The response contains the requested data.
                                </p>
                              </div>
                              
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-blue-500">201 - Created</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  The resource was successfully created. The response contains the created resource.
                                </p>
                              </div>
                              
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-amber-500">400 - Bad Request</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  The request was invalid or cannot be processed. Check the request parameters.
                                </p>
                              </div>
                              
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-red-500">401 - Unauthorized</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Authentication credentials are missing or invalid.
                                </p>
                              </div>
                              
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-red-500">404 - Not Found</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  The requested resource could not be found.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Select an API endpoint to view details</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}