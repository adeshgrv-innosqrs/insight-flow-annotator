import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionPanel from '@/components/QuestionPanel';
import SearchPanel from '@/components/SearchPanel';
import HistoryPanel from '@/components/HistoryPanel';
import Header from '@/components/Header';
import SubmitSection from '@/components/SubmitSection';
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

  // Check authentication
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setQuestions(sampleQuestions);
    
    // Load user history
    const userHistory = localStorage.getItem(`history_${parsedUser.id}`) || '[]';
    setHistory(JSON.parse(userHistory));
    
    setIsLoading(false);
  }, [navigate]);

  const handleSearch = async (query) => {
    // Simulate OpenAI API call
    setSearchResults({ loading: true });
    
    setTimeout(() => {
      const mockResponse = {
        query: query,
        response: `Based on current information, here's what I found regarding "${query}": This is a simulated GPT response that would normally come from OpenAI's API. The response includes relevant information, key insights, and contextual details that help answer the query comprehensively.`,
        timestamp: new Date().toISOString(),
        confidence: 0.85
      };
      setSearchResults(mockResponse);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!searchResults || searchResults.loading) {
      toast({
        title: "No search results",
        description: "Please perform a search before submitting.",
        variant: "destructive"
      });
      return;
    }

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
    
    // Save to localStorage (in real app, this would be API call)
    localStorage.setItem(`history_${user.id}`, JSON.stringify(newHistory));

    toast({
      title: "Submission recorded",
      description: "Your evaluation has been saved successfully."
    });

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
      
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* History Section */}
        <div className="p-4 border-b border-border">
          <HistoryPanel history={history} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Questions */}
          <div className="w-1/2 border-r border-border">
            <QuestionPanel
              questions={questions}
              currentIndex={currentQuestionIndex}
              onNavigate={navigateQuestion}
            />
          </div>

          {/* Right Panel - Search */}
          <div className="w-1/2">
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