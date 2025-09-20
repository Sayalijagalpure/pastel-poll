import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  HelpCircle, 
  Shield, 
  Vote, 
  Users, 
  Clock, 
  CheckCircle,
  Eye,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export const HelpSidebar = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setOpenItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const faqs: FAQ[] = [
    {
      question: "How do I vote?",
      answer: "Simply click on any active poll from the dashboard, select your preferred option, and click 'Submit Vote'. You can only vote once per poll.",
      icon: <Vote className="w-4 h-4" />
    },
    {
      question: "Is my vote anonymous?",
      answer: "Yes! While we track that you've voted to prevent multiple votes, your specific choice is completely anonymous. No one can see how you voted.",
      icon: <Eye className="w-4 h-4" />
    },
    {
      question: "Can I change my vote?",
      answer: "No, votes are final once submitted. This ensures the integrity of the voting process and prevents vote manipulation.",
      icon: <Lock className="w-4 h-4" />
    },
    {
      question: "How secure is this platform?",
      answer: "We use enterprise-grade security with encrypted data storage, secure authentication, and prevent duplicate voting through unique constraints.",
      icon: <Shield className="w-4 h-4" />
    },
    {
      question: "When do polls expire?",
      answer: "Poll creators can set custom expiry dates. Expired polls will show results but won't accept new votes. Some polls may run indefinitely.",
      icon: <Clock className="w-4 h-4" />
    },
    {
      question: "Can I create my own polls?",
      answer: "Yes! Click 'Create Poll' from the dashboard. You can add multiple options, descriptions, and set expiry dates for your polls.",
      icon: <Users className="w-4 h-4" />
    },
    {
      question: "How are results calculated?",
      answer: "Results are calculated in real-time. Percentages are based on the total number of votes cast, and charts update automatically.",
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <HelpCircle className="w-5 h-5 mr-2 text-primary" />
          Help & FAQ
        </CardTitle>
        <CardDescription>
          Everything you need to know about SecureVote
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Security Assurance */}
        <div className="p-4 bg-accent/20 rounded-lg border border-accent">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Your Privacy Matters</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your vote choices are completely anonymous. We only track that you've voted, not what you voted for.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground mb-3">Frequently Asked Questions</h4>
          
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(`faq-${index}`);
            
            return (
              <Collapsible key={index}>
                <CollapsibleTrigger 
                  onClick={() => toggleItem(`faq-${index}`)}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left p-3 h-auto hover:bg-accent/50"
                  >
                    <div className="flex items-center space-x-2">
                      {faq.icon}
                      <span className="text-sm font-medium">{faq.question}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-3 pb-3">
                    <p className="text-xs text-muted-foreground leading-relaxed ml-6">
                      {faq.answer}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Contact */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Need more help? Contact our support team for assistance with your voting experience.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};