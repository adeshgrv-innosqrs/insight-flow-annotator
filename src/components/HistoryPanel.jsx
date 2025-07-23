import { useState } from 'react';
import { History, Calendar, FileText, ExternalLink, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const HistoryPanel = ({ history, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(history.length - 1);

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

  const item = history[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <History className="h-5 w-5 mr-2 text-primary" />
          Evaluation {currentIndex + 1} of {history.length}
        </h2>
        <Badge variant="secondary" className="text-xs">
          {history.length} total
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    <span>Saved</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-destructive"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === history.length - 1}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default HistoryPanel;
