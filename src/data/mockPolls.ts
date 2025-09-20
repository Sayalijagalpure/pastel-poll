export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  creator_email: string;
  total_votes: number;
  genre: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface UserVote {
  poll_id: string;
  option_id: string;
  user_email: string;
}

// Mock polls data
export const mockPolls: Poll[] = [
  // Environment & Climate
  {
    id: "poll-1",
    title: "Best Programming Language for Web Development",
    description: "Which programming language do you think is the best for modern web development in 2024?",
    options: [
      { id: "opt-1-1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "opt-1-2", text: "Python", votes: 23 },
      { id: "opt-1-3", text: "Java", votes: 18 },
      { id: "opt-1-4", text: "C#", votes: 12 },
      { id: "opt-1-5", text: "Go", votes: 8 }
    ],
    created_at: "2024-01-15T10:00:00Z",
    expires_at: "2024-02-15T23:59:59Z",
    is_active: true,
    creator_email: "admin@securevote.com",
    total_votes: 106,
    genre: "Technology & Innovation"
  },
  {
    id: "poll-2",
    title: "Remote Work Preference",
    description: "What is your preferred work arrangement post-pandemic?",
    options: [
      { id: "opt-2-1", text: "Fully Remote", votes: 67 },
      { id: "opt-2-2", text: "Hybrid (2-3 days office)", votes: 89 },
      { id: "opt-2-3", text: "Mostly Office (4-5 days)", votes: 34 },
      { id: "opt-2-4", text: "Fully Office", votes: 15 }
    ],
    created_at: "2024-01-10T14:30:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "hr@company.com",
    total_votes: 205,
    genre: "Economy & Work"
  },
  {
    id: "poll-3",
    title: "Favorite Frontend Framework",
    description: "Which frontend framework/library do you prefer for building user interfaces?",
    options: [
      { id: "opt-3-1", text: "React", votes: 78 },
      { id: "opt-3-2", text: "Vue.js", votes: 45 },
      { id: "opt-3-3", text: "Angular", votes: 32 },
      { id: "opt-3-4", text: "Svelte", votes: 28 },
      { id: "opt-3-5", text: "Vanilla JS", votes: 12 }
    ],
    created_at: "2024-01-12T09:15:00Z",
    expires_at: "2024-01-25T23:59:59Z",
    is_active: true,
    creator_email: "dev@techcorp.com",
    total_votes: 195,
    genre: "Technology & Innovation"
  },
  {
    id: "poll-4",
    title: "Coffee vs Tea",
    description: "The eternal debate: What's your preferred morning beverage?",
    options: [
      { id: "opt-4-1", text: "Coffee", votes: 156 },
      { id: "opt-4-2", text: "Tea", votes: 89 },
      { id: "opt-4-3", text: "Both equally", votes: 45 },
      { id: "opt-4-4", text: "Neither (other beverages)", votes: 23 }
    ],
    created_at: "2024-01-08T08:00:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "office@company.com",
    total_votes: 313,
    genre: "Healthcare & Wellness"
  },
  {
    id: "poll-5",
    title: "Best Time for Team Meetings",
    description: "When do you think is the most productive time for team meetings?",
    options: [
      { id: "opt-5-1", text: "Morning (9-11 AM)", votes: 67 },
      { id: "opt-5-2", text: "Late Morning (11 AM-12 PM)", votes: 43 },
      { id: "opt-5-3", text: "Early Afternoon (1-3 PM)", votes: 29 },
      { id: "opt-5-4", text: "Late Afternoon (3-5 PM)", votes: 18 }
    ],
    created_at: "2024-01-14T16:45:00Z",
    expires_at: "2024-01-30T17:00:00Z",
    is_active: true,
    creator_email: "manager@team.com",
    total_votes: 157,
    genre: "Economy & Work"
  },

  // Environment & Climate
  {
    id: "poll-6",
    title: "Most Effective Climate Action",
    description: "What do you believe is the most impactful action individuals can take to combat climate change?",
    options: [
      { id: "opt-6-1", text: "Reduce meat consumption", votes: 89 },
      { id: "opt-6-2", text: "Use public transportation", votes: 67 },
      { id: "opt-6-3", text: "Reduce energy consumption at home", votes: 134 },
      { id: "opt-6-4", text: "Plant trees and support reforestation", votes: 98 },
      { id: "opt-6-5", text: "Reduce plastic usage", votes: 76 }
    ],
    created_at: "2024-01-16T12:00:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "eco@climateaction.org",
    total_votes: 464,
    genre: "Environment & Climate"
  },
  {
    id: "poll-7",
    title: "Renewable Energy Priority",
    description: "Which renewable energy source should governments prioritize for investment?",
    options: [
      { id: "opt-7-1", text: "Solar Power", votes: 156 },
      { id: "opt-7-2", text: "Wind Power", votes: 134 },
      { id: "opt-7-3", text: "Hydroelectric", votes: 89 },
      { id: "opt-7-4", text: "Geothermal", votes: 67 },
      { id: "opt-7-5", text: "Nuclear (clean energy)", votes: 43 }
    ],
    created_at: "2024-01-18T14:30:00Z",
    expires_at: "2024-02-18T23:59:59Z",
    is_active: true,
    creator_email: "energy@greenfuture.com",
    total_votes: 489,
    genre: "Environment & Climate"
  },

  // Healthcare & Wellness
  {
    id: "poll-8",
    title: "Mental Health in Workplace",
    description: "Should companies provide mandatory mental health days for employees?",
    options: [
      { id: "opt-8-1", text: "Yes, absolutely necessary", votes: 234 },
      { id: "opt-8-2", text: "Yes, but optional", votes: 167 },
      { id: "opt-8-3", text: "No, current PTO is sufficient", votes: 89 },
      { id: "opt-8-4", text: "Mental health support should be different", votes: 56 }
    ],
    created_at: "2024-01-17T09:00:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "wellness@companyhr.com",
    total_votes: 546,
    genre: "Healthcare & Wellness"
  },
  {
    id: "poll-9",
    title: "Healthcare System Preference",
    description: "What type of healthcare system do you think works best?",
    options: [
      { id: "opt-9-1", text: "Universal healthcare (government-funded)", votes: 198 },
      { id: "opt-9-2", text: "Mixed public-private system", votes: 145 },
      { id: "opt-9-3", text: "Private insurance model", votes: 78 },
      { id: "opt-9-4", text: "Single-payer system", votes: 123 }
    ],
    created_at: "2024-01-19T16:20:00Z",
    expires_at: "2024-02-10T23:59:59Z",
    is_active: true,
    creator_email: "healthcare@policy.org",
    total_votes: 544,
    genre: "Healthcare & Wellness"
  },

  // Education & Learning
  {
    id: "poll-10",
    title: "Online vs Traditional Education",
    description: "For higher education, which format do you believe provides better learning outcomes?",
    options: [
      { id: "opt-10-1", text: "Traditional in-person university", votes: 123 },
      { id: "opt-10-2", text: "Online/distance learning", votes: 98 },
      { id: "opt-10-3", text: "Hybrid approach", votes: 167 },
      { id: "opt-10-4", text: "It depends on the field of study", votes: 145 }
    ],
    created_at: "2024-01-20T11:15:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "education@learning.org",
    total_votes: 533,
    genre: "Education & Learning"
  },
  {
    id: "poll-11",
    title: "Most Important Skill for Future",
    description: "Which skill do you think will be most valuable in the job market of 2030?",
    options: [
      { id: "opt-11-1", text: "Artificial Intelligence & Machine Learning", votes: 189 },
      { id: "opt-11-2", text: "Digital Literacy & Cybersecurity", votes: 156 },
      { id: "opt-11-3", text: "Critical Thinking & Problem Solving", votes: 234 },
      { id: "opt-11-4", text: "Emotional Intelligence & Leadership", votes: 123 },
      { id: "opt-11-5", text: "Sustainability & Green Technologies", votes: 98 }
    ],
    created_at: "2024-01-22T13:45:00Z",
    expires_at: "2024-02-20T23:59:59Z",
    is_active: true,
    creator_email: "future@skills.org",
    total_votes: 800,
    genre: "Education & Learning"
  },

  // Social Issues & Equality
  {
    id: "poll-12",
    title: "Gender Pay Gap Solutions",
    description: "What is the most effective way to address the gender pay gap in the workplace?",
    options: [
      { id: "opt-12-1", text: "Transparent salary disclosure policies", votes: 167 },
      { id: "opt-12-2", text: "Mandatory pay equity audits", votes: 145 },
      { id: "opt-12-3", text: "Government legislation and fines", votes: 123 },
      { id: "opt-12-4", text: "Company culture and awareness programs", votes: 98 },
      { id: "opt-12-5", text: "Union representation and collective bargaining", votes: 76 }
    ],
    created_at: "2024-01-21T10:30:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "equality@socialjustice.org",
    total_votes: 609,
    genre: "Social Issues & Equality"
  },
  {
    id: "poll-13",
    title: "Social Media Regulation",
    description: "Should social media platforms be more heavily regulated to combat misinformation?",
    options: [
      { id: "opt-13-1", text: "Yes, government should regulate content", votes: 234 },
      { id: "opt-13-2", text: "Yes, but self-regulation by platforms", votes: 198 },
      { id: "opt-13-3", text: "No, free speech should be protected", votes: 145 },
      { id: "opt-13-4", text: "Fact-checking partnerships only", votes: 167 }
    ],
    created_at: "2024-01-23T15:00:00Z",
    expires_at: "2024-02-15T23:59:59Z",
    is_active: true,
    creator_email: "media@democracy.org",
    total_votes: 744,
    genre: "Social Issues & Equality"
  },

  // Technology & Innovation
  {
    id: "poll-14",
    title: "AI Impact on Jobs",
    description: "How do you think artificial intelligence will most affect employment in the next decade?",
    options: [
      { id: "opt-14-1", text: "Create more jobs than it eliminates", votes: 156 },
      { id: "opt-14-2", text: "Eliminate more jobs than it creates", votes: 123 },
      { id: "opt-14-3", text: "Transform existing jobs rather than replace", votes: 234 },
      { id: "opt-14-4", text: "Lead to universal basic income necessity", votes: 98 },
      { id: "opt-14-5", text: "Have minimal overall impact", votes: 67 }
    ],
    created_at: "2024-01-24T12:20:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "ai@futureofwork.com",
    total_votes: 678,
    genre: "Technology & Innovation"
  },
  {
    id: "poll-15",
    title: "Cryptocurrency Future",
    description: "Do you believe cryptocurrency will become mainstream currency by 2030?",
    options: [
      { id: "opt-15-1", text: "Yes, will replace traditional banking", votes: 89 },
      { id: "opt-15-2", text: "Yes, but alongside traditional currency", votes: 156 },
      { id: "opt-15-3", text: "No, too volatile and risky", votes: 134 },
      { id: "opt-15-4", text: "No, will be regulated out of existence", votes: 78 },
      { id: "opt-15-5", text: "Unsure, depends on government policies", votes: 167 }
    ],
    created_at: "2024-01-25T17:30:00Z",
    expires_at: "2024-02-25T23:59:59Z",
    is_active: true,
    creator_email: "crypto@fintech.org",
    total_votes: 624,
    genre: "Technology & Innovation"
  },

  // Economy & Work
  {
    id: "poll-16",
    title: "Four-Day Work Week",
    description: "Would you support implementing a four-day work week in your workplace?",
    options: [
      { id: "opt-16-1", text: "Yes, with same pay and productivity", votes: 278 },
      { id: "opt-16-2", text: "Yes, but with reduced pay", votes: 67 },
      { id: "opt-16-3", text: "No, prefer traditional five-day week", votes: 123 },
      { id: "opt-16-4", text: "Depends on the industry and role", votes: 189 }
    ],
    created_at: "2024-01-26T09:45:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "worklife@balance.org",
    total_votes: 657,
    genre: "Economy & Work"
  },
  {
    id: "poll-17",
    title: "Remote Work Productivity",
    description: "Compared to office work, how productive do you feel when working remotely?",
    options: [
      { id: "opt-17-1", text: "Significantly more productive", votes: 145 },
      { id: "opt-17-2", text: "Somewhat more productive", votes: 167 },
      { id: "opt-17-3", text: "About the same productivity", votes: 134 },
      { id: "opt-17-4", text: "Somewhat less productive", votes: 89 },
      { id: "opt-17-5", text: "Significantly less productive", votes: 43 }
    ],
    created_at: "2024-01-27T14:15:00Z",
    expires_at: "2024-02-20T23:59:59Z",
    is_active: true,
    creator_email: "productivity@remote.com",
    total_votes: 578,
    genre: "Economy & Work"
  },

  // Additional Environment & Climate
  {
    id: "poll-18",
    title: "Sustainable Transportation",
    description: "What is the most practical sustainable transportation option for urban areas?",
    options: [
      { id: "opt-18-1", text: "Electric vehicles (cars)", votes: 123 },
      { id: "opt-18-2", text: "Public transportation expansion", votes: 167 },
      { id: "opt-18-3", text: "Bicycle infrastructure development", votes: 98 },
      { id: "opt-18-4", text: "Walking and pedestrian zones", votes: 89 },
      { id: "opt-18-5", text: "Carpooling and ride-sharing", votes: 76 }
    ],
    created_at: "2024-01-28T11:00:00Z",
    expires_at: null,
    is_active: true,
    creator_email: "urban@planning.org",
    total_votes: 553,
    genre: "Environment & Climate"
  },

  // Additional Healthcare & Wellness
  {
    id: "poll-19",
    title: "Workplace Wellness Programs",
    description: "Which workplace wellness benefit do you find most valuable?",
    options: [
      { id: "opt-19-1", text: "Gym memberships/fitness subsidies", votes: 134 },
      { id: "opt-19-2", text: "Mental health counseling", votes: 189 },
      { id: "opt-19-3", text: "Flexible working hours", votes: 156 },
      { id: "opt-19-4", text: "Healthy food options at work", votes: 98 },
      { id: "opt-19-5", text: "Wellness workshops and seminars", votes: 67 }
    ],
    created_at: "2024-01-29T16:30:00Z",
    expires_at: "2024-02-28T23:59:59Z",
    is_active: true,
    creator_email: "wellness@corporate.com",
    total_votes: 644,
    genre: "Healthcare & Wellness"
  }
];

// Mock user votes (stored in localStorage)
export const getUserVotes = (): UserVote[] => {
  const votes = localStorage.getItem('userVotes');
  return votes ? JSON.parse(votes) : [];
};

export const saveUserVote = (vote: UserVote): void => {
  const votes = getUserVotes();
  const polls = getAllPolls();
  
  // Remove any existing vote for this poll by this user
  const existingVote = votes.find(v => v.poll_id === vote.poll_id && v.user_email === vote.user_email);
  const filteredVotes = votes.filter(v => !(v.poll_id === vote.poll_id && v.user_email === vote.user_email));
  
  // Update poll vote counts
  const updatedPolls = polls.map(poll => {
    if (poll.id === vote.poll_id) {
      const updatedOptions = poll.options.map(option => {
        let newVotes = option.votes;
        
        // Remove vote from previous option if user changed their vote
        if (existingVote && option.id === existingVote.option_id) {
          newVotes = Math.max(0, newVotes - 1);
        }
        
        // Add vote to new option
        if (option.id === vote.option_id) {
          newVotes = newVotes + 1;
        }
        
        return { ...option, votes: newVotes };
      });
      
      const newTotalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0);
      
      return {
        ...poll,
        options: updatedOptions,
        total_votes: newTotalVotes
      };
    }
    return poll;
  });
  
  // Save updated polls and votes
  localStorage.setItem('allPolls', JSON.stringify(updatedPolls));
  filteredVotes.push(vote);
  localStorage.setItem('userVotes', JSON.stringify(filteredVotes));
};

export const hasUserVoted = (pollId: string, userEmail: string): boolean => {
  const votes = getUserVotes();
  return votes.some(vote => vote.poll_id === pollId && vote.user_email === userEmail);
};

export const getUserVoteForPoll = (pollId: string, userEmail: string): UserVote | null => {
  const votes = getUserVotes();
  return votes.find(vote => vote.poll_id === pollId && vote.user_email === userEmail) || null;
};

// Poll management functions
export const getAllPolls = (): Poll[] => {
  const storedPolls = localStorage.getItem('allPolls');
  return storedPolls ? JSON.parse(storedPolls) : mockPolls;
};

export const addNewPoll = (pollData: {
  title: string;
  description: string;
  options: string[];
  expires_at: string | null;
  creator_email: string;
  creator_role?: string;
  genre: string;
}): Poll => {
  const polls = getAllPolls();
  
  const newPoll: Poll = {
    id: `poll-${Date.now()}`,
    title: pollData.title,
    description: pollData.description,
    options: pollData.options.map((text, index) => ({
      id: `opt-${Date.now()}-${index}`,
      text,
      votes: 0
    })),
    created_at: new Date().toISOString(),
    expires_at: pollData.expires_at,
    is_active: true,
    creator_email: pollData.creator_email,
    total_votes: 0,
    genre: pollData.genre
  };
  
  const updatedPolls = [newPoll, ...polls];
  localStorage.setItem('allPolls', JSON.stringify(updatedPolls));
  
  return newPoll;
};

export const deletePoll = (pollId: string): boolean => {
  const polls = getAllPolls();
  const votes = getUserVotes();
  
  // Check if poll exists
  const pollExists = polls.some(poll => poll.id === pollId);
  if (!pollExists) {
    return false;
  }
  
  // Remove poll from polls array
  const updatedPolls = polls.filter(poll => poll.id !== pollId);
  localStorage.setItem('allPolls', JSON.stringify(updatedPolls));
  
  // Remove all votes associated with this poll
  const updatedVotes = votes.filter(vote => vote.poll_id !== pollId);
  localStorage.setItem('userVotes', JSON.stringify(updatedVotes));
  
  return true;
};
