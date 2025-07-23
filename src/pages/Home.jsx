import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionPanel from '@/components/QuestionPanel';
import SearchPanel from '@/components/SearchPanel';
import HistoryPanel from '@/components/HistoryPanel';
import Header from '@/components/Header';
import SubmitSection from '@/components/SubmitSection';
import ApiService from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample questions data
  const sampleQuestions = [
    {
      id: 1,
      text: "What are the latest developments in artificial intelligence that could impact the healthcare industry?",
      category: "Technology & Healthcare"
    },
    {
      id: 2,
      text: "How has the global supply chain been affected by recent geopolitical events?",
      category: "Economics & Politics"
    },
    {
      id: 3,
      text: "What are the emerging trends in renewable energy adoption worldwide?",
      category: "Environment & Energy"
    },
    {
      id: 4,
      text: "How are remote work policies evolving in major corporations post-pandemic?",
      category: "Business & Workplace"
    },
    {
      id: 5,
      text: "What are the latest breakthroughs in quantum computing research?",
      category: "Technology & Science"
    }
  ];

  // Check authentication and load data
  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      try {
        // Load questions from Django API
        const questionsData = await ApiService.getQuestions();
        setQuestions(questionsData);

        // Load user history from Django API
        const historyData = await ApiService.getUserHistory();
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to sample questions if API fails
        setQuestions(sampleQuestions);

        // Load local history as fallback
        const userHistory = localStorage.getItem(`history_${parsedUser.id}`) || '[]';
        setHistory(JSON.parse(userHistory));

        toast({
          title: "API Connection Failed",
          description: "Using sample data. Check Django backend connection.",
          variant: "destructive"
        });
      }

      setIsLoading(false);
    };

    loadData();
  }, [navigate]);

  const handleSearch = async (query) => {
    setSearchResults({ loading: true });

    try {
      // Try Django API first
      const response = await ApiService.searchWithAI(query);
      setSearchResults(response);
    } catch (error) {
      console.error('API search failed, using mock response:', error);

      // Fallback to mock response
      setTimeout(() => {
        const mockResponse = {
          query: query,
          response: `Based on current information, here's what I found regarding "${query}": This is a simulated GPT response that would normally come from OpenAI's API via Django backend. The response includes relevant information, key insights, and contextual details that help answer the query comprehensively.`,
          timestamp: new Date().toISOString(),
          confidence: 0.85
        };
        setSearchResults(mockResponse);
      }, 1500);
    }
  };

  const handleSubmit = async () => {
    if (!searchResults || searchResults.loading) {
      toast({
        title: "No search results",
        description: "Please perform a search before submitting.",
        variant: "destructive"
      });
      return;
    }

    const evaluationData = {
      question_id: questions[currentQuestionIndex].id,
      search_query: searchResults.query,
      gpt_response: searchResults.response,
    };

    try {
      // Try Django API first
      const response = await ApiService.submitEvaluation(evaluationData);

      // Update local history with server response
      const newHistory = [response.evaluation, ...history];
      setHistory(newHistory);

      toast({
        title: "Submission recorded",
        description: "Your evaluation has been saved successfully."
      });

    } catch (error) {
      console.error('API submission failed, saving locally:', error);

      // Fallback to local storage
      const submission = {
        id: Date.now(),
        questionId: questions[currentQuestionIndex].id,
        questionText: questions[currentQuestionIndex].text,
        searchQuery: searchResults.query,
        gptAnswer: searchResults.response,
        userId: user.id,
        timestamp: new Date().toISOString()
      };

      const newHistory = [submission, ...history];
      setHistory(newHistory);

      // Save to localStorage as fallback
      localStorage.setItem(`history_${user.id}`, JSON.stringify(newHistory));

      toast({
        title: "Saved locally",
        description: "Your evaluation was saved locally. Check Django backend connection.",
        variant: "destructive"
      });
    }

    // Clear search results and move to next question
    setSearchResults(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSearchResults(null);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSearchResults(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={() => {
        localStorage.removeItem('user');
        navigate('/login');
      }} />

      <div className="flex flex-col min-h-[1600px]">
        {/* History Section */}
        <div className="p-4 border-b border-border">
          <HistoryPanel history={history} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Question List (scrollable) */}
          <div className="w-[30%] border-r border-border overflow-y-auto p-4">
            <div className="mt-2">
              <h3 className="text-sm font-medium text-foreground mb-3">All Questions</h3>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg border text-sm cursor-pointer transition-colors ${index === currentQuestionIndex
                        ? 'bg-question-active border-primary'
                        : 'bg-card border-border hover:bg-muted'
                      }`}
                    onClick={() => {
                      if (index !== currentQuestionIndex) {
                        const confirmSwitch = window.confirm('Switch to this question? Any unsaved search results will be lost.');
                        if (confirmSwitch) {
                          setCurrentQuestionIndex(index);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Q{index + 1}</span>
                      <div className="bg-secondary text-xs text-muted px-2 py-0.5 rounded">
                        {question.category}
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {question.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Middle Panel - Current Question */}
          <div className="w-[45%] border-r border-border overflow-y-auto">
            <QuestionPanel
              questions={questions}
              currentIndex={currentQuestionIndex}
              onNavigate={navigateQuestion}
            />
          </div>

          {/* Right Panel - Search */}
          <div className="w-[40%] overflow-y-auto">
            <SearchPanel
              onSearch={handleSearch}
              searchResults={searchResults}
            />
          </div>
        </div>


        {/* Submit Section */}
        <div className="border-t border-border">
          <SubmitSection
            onSubmit={handleSubmit}
            hasResults={searchResults && !searchResults.loading}
            currentQuestion={questions[currentQuestionIndex]}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;