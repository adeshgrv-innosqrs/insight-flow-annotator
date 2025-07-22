import { History, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const HistoryPanel = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-6 text-center">
        <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <h3 className="text-sm font-medium text-foreground mb-1">No Evaluations Yet</h3>
        <p className="text-xs text-muted-foreground">
          Your completed evaluations will appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <History className="h-5 w-5 mr-2 text-primary" />
          Recent Evaluations
        </h2>
        <Badge variant="secondary" className="text-xs">
          {history.length} completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
        {history.slice(0, 6).map((item) => (
          <Card key={item.id} className="shadow-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-medium line-clamp-2 flex-1">
                  Q{item.questionId}: {item.questionText.substring(0, 50)}...
                </CardTitle>
                <Button variant="ghost" size="sm" className="p-1 h-auto ml-2">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Search Query:</p>
                  <p className="text-xs bg-muted p-2 rounded line-clamp-2">
                    {item.searchQuery}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    <span>Saved</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {history.length > 6 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All {history.length} Evaluations
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;