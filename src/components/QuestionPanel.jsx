import { ChevronLeft, ChevronRight, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const QuestionPanel = ({ questions, currentIndex, onNavigate }) => {
  const currentQuestion = questions[currentIndex];

  return (
    <div className="h-full flex flex-col bg-panel">
      {/* Header */}
      <div className="p-6 border-b border-panel-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Questions
          </h2>
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1} of {questions.length}
          </Badge>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
            disabled={currentIndex === 0}
            className="flex-1 mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
            disabled={currentIndex === questions.length - 1}
            className="flex-1 ml-2"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Current Question */}
      <div className="flex-1 p-6">
        <Card className="h-full shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-foreground">
                Question {currentIndex + 1}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {currentQuestion?.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed text-base">
                {currentQuestion?.text}
              </p>
              
              <div className="flex items-center text-sm text-muted-foreground mt-6">
                <Clock className="h-4 w-4 mr-2" />
                <span>Take your time to research and provide a thorough evaluation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question List Preview */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">All Questions</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                  index === currentIndex 
                    ? 'bg-question-active border-primary' 
                    : 'bg-card border-border hover:bg-muted'
                }`}
                onClick={() => {
                  if (index !== currentIndex) {
                    // You could add confirmation dialog here
                    const confirmSwitch = window.confirm('Switch to this question? Any unsaved search results will be lost.');
                    if (confirmSwitch) {
                      onNavigate(index > currentIndex ? 'next' : 'prev');
                    }
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Q{index + 1}</span>
                  <Badge variant="secondary" className="text-xs">
                    {question.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 line-clamp-2">
                  {question.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;