import { CheckCircle, Send, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SubmitSection = ({ onSubmit, hasResults, currentQuestion }) => {
  return (
    <div className="bg-card p-6">
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {/* Left side - Status and info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {hasResults ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {hasResults ? 'Ready to Submit' : 'Search Required'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hasResults 
                      ? 'AI response ready for evaluation submission'
                      : 'Perform a search before submitting your evaluation'
                    }
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-2 text-xs text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Question {currentQuestion?.id || 1}</span>
              </div>
            </div>

            {/* Right side - Submit button */}
            <div className="flex items-center space-x-3">
              <div className="text-right text-xs text-muted-foreground hidden sm:block">
                <p>Click to record your</p>
                <p>evaluation response</p>
              </div>
              
              <Button
                onClick={onSubmit}
                disabled={!hasResults}
                size="lg"
                className="px-8"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Evaluation
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Evaluation Progress</span>
              <span className="font-medium">
                Question {currentQuestion?.id || 1} of 5
              </span>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion?.id || 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitSection;