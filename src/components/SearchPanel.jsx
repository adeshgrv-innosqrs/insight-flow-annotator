import { useState } from 'react';
import { Search, Send, Sparkles, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SearchPanel = ({ onSearch, searchResults }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="h-full flex flex-col bg-search-background">
      {/* Header */}
      <div className="p-6 border-b border-panel-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Search className="h-5 w-5 mr-2 text-primary" />
          AI Research Assistant
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Use AI to research and gather relevant information
        </p>
      </div>

      {/* Search Form */}
      <div className="p-6 border-b border-panel-border">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your research query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 pr-12 text-base"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || (searchResults?.loading)}
              className="absolute right-1 top-1 h-10 px-3"
            >
              {searchResults?.loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 mr-1" />
            <span>Powered by OpenAI GPT-4</span>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {!searchResults && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="bg-muted rounded-full p-4 w-fit mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Ready to Research</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enter a search query above to get AI-powered insights and information 
                  to help you evaluate the current question.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>• Ask specific questions about the topic</p>
                <p>• Request recent developments or trends</p>
                <p>• Get contextual information and analysis</p>
              </div>
            </div>
          </div>
        )}

        {searchResults?.loading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Searching...</h3>
                <p className="text-muted-foreground">AI is analyzing your query</p>
              </div>
            </div>
          </div>
        )}

        {searchResults && !searchResults.loading && (
          <div className="space-y-6">
            {/* Query Info */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Search Complete
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Confidence: {Math.round(searchResults.confidence * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Query:</p>
                  <p className="text-sm font-medium bg-muted p-2 rounded">
                    {searchResults.query}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(searchResults.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Response */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {searchResults.response}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Hint */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">Ready to Submit</p>
                  <p className="text-blue-700 mt-1">
                    Review the AI response and click Submit below to record your evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;