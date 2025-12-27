# Squad Props

A social recognition smart contract for Stacks blockchain built with Clarity. Give props to your squad, track contributions, build reputation, and celebrate achievements on-chain.

## What It Does

Squad Props allows you to:
- Give props (kudos) to community members
- Track who gives and receives props
- Build reputation scores
- View leaderboards of top contributors
- See your props history
- Create a culture of recognition

Perfect for:
- Team recognition systems
- Community engagement
- DAO contribution tracking
- Learning social token mechanics
- Building reputation systems
- Creating positive culture

## Features

- **Give Props**: Send recognition to anyone
- **Reputation Building**: Accumulate props over time
- **Leaderboards**: See top contributors
- **History Tracking**: View all props given/received
- **With Messages**: Add context to your props
- **Public Recognition**: All props visible on-chain
- **No Cost**: Props are free to give (small gas only)

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) installed
- Basic understanding of Stacks blockchain
- A Stacks wallet for testnet deployment

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/squad-props.git
cd squad-props

# Check Clarinet installation
clarinet --version
```

## Project Structure

```
squad-props/
├── contracts/
│   └── squad-props.clar     # Main kudos contract
├── tests/
│   └── squad-props_test.ts  # Contract tests
├── Clarinet.toml            # Project configuration
└── README.md
```

## Usage

### Deploy Locally

```bash
# Start Clarinet console
clarinet console

# Give props to someone
(contract-call? .squad-props give-props 
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
  "Amazing work on the smart contract! 🚀"
)

# Check someone's props count
(contract-call? .squad-props get-props-received 
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
)

# View top 10 leaderboard
(contract-call? .squad-props get-top-contributors)

# Get your props history
(contract-call? .squad-props get-user-history tx-sender)
```

### Contract Functions

**give-props (recipient, message)**
```clarity
(contract-call? .squad-props give-props 
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
  "Great contribution to the project!"
)
```
Give props to someone with a message

**give-multiple-props (recipient, amount, message)**
```clarity
(contract-call? .squad-props give-multiple-props 
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
  u5
  "Outstanding work this week! 5 props!"
)
```
Give multiple props at once

**get-props-received (user)**
```clarity
(contract-call? .squad-props get-props-received 
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
)
```
Get total props received by a user

**get-props-given (user)**
```clarity
(contract-call? .squad-props get-props-given tx-sender)
```
Get total props you've given out

**get-user-history (user)**
```clarity
(contract-call? .squad-props get-user-history tx-sender)
```
Get all props received with messages

**get-top-contributors**
```clarity
(contract-call? .squad-props get-top-contributors)
```
Get top 10 users by props received

**get-total-props**
```clarity
(contract-call? .squad-props get-total-props)
```
Get total props given across entire system

**get-user-rank (user)**
```clarity
(contract-call? .squad-props get-user-rank tx-sender)
```
Get your rank on the leaderboard

**has-given-props-to (giver, receiver)**
```clarity
(contract-call? .squad-props has-given-props-to 
  tx-sender
  'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
)
```
Check if you've given props to someone

## How It Works

### Giving Props
1. User selects recipient
2. Writes message explaining why
3. Props recorded on-chain
4. Recipient's score increases
5. Giver's contribution tracked
6. Public record created

### Reputation System
- Each prop = 1 point
- Points accumulate over time
- Cannot be removed or decreased
- Public and transparent
- Reflects contribution value

### Leaderboard
- Ranks by total props received
- Updates in real-time
- Top 10 displayed
- Ties handled by earliest achievement
- Motivates positive contributions

## Data Structure

### Props Record
```clarity
{
  id: uint,
  giver: principal,
  receiver: principal,
  message: (string-utf8 500),
  timestamp: uint,
  amount: uint
}
```

### User Stats
```clarity
{
  props-received: uint,
  props-given: uint,
  first-props-received: uint,  ;; Block height
  rank: uint
}
```

### Storage Pattern
```clarity
;; Map of user to total props received
(define-map props-received principal uint)

;; Map of user to total props given
(define-map props-given principal uint)

;; List of all props transactions
(define-data-var props-history (list 10000 props-record) (list))

;; Counter for total props
(define-data-var total-props-count uint u0)
```

## Testing

```bash
# Run all tests
npm run test

# Check contract syntax
clarinet check

# Run specific test
npm run test -- squad-props
```

## Learning Goals

Building this contract teaches you:
- ✅ Social token mechanics
- ✅ Reputation systems
- ✅ Tracking relationships (who gave to whom)
- ✅ Leaderboard implementation
- ✅ History and audit trails
- ✅ Community engagement patterns

## Example Use Cases

**Team Recognition:**
```clarity
;; Manager gives props to team member
(contract-call? .squad-props give-props 
  'ST1DEVELOPER
  "Shipped the feature ahead of schedule! Excellent work!"
)

;; Team member gives props to peer
(contract-call? .squad-props give-props 
  'ST1TEAMMATE
  "Thanks for helping me debug that issue!"
)
```

**Community Contributions:**
```clarity
;; Recognize community helper
(contract-call? .squad-props give-props 
  'ST1HELPER
  "Always answers questions in Discord. Community MVP!"
)

;; Thank content creator
(contract-call? .squad-props give-props 
  'ST1CREATOR
  "Your tutorial helped me learn Clarity. Thank you!"
)
```

**DAO Participation:**
```clarity
;; Recognize active governance participant
(contract-call? .squad-props give-multiple-props 
  'ST1VOTER
  u10
  "Active in all proposals this month. 10 props!"
)

;; Thank proposal author
(contract-call? .squad-props give-props 
  'ST1AUTHOR
  "Great proposal that passed! Props for the effort!"
)
```

**Open Source Contributions:**
```clarity
;; Thank code contributor
(contract-call? .squad-props give-props 
  'ST1CONTRIBUTOR
  "Your PR fixed a critical bug. Much appreciated!"
)

;; Recognize documentation writer
(contract-call? .squad-props give-props 
  'ST1WRITER
  "Documentation is so much better now. Thanks!"
)
```

## Props Flow

### Complete Lifecycle:
```
1. RECOGNIZE → Notice someone's contribution
   ↓
2. GIVE PROPS → Send props with message
   ↓
3. RECORD → Stored on-chain permanently
   ↓
4. UPDATE SCORES → Reputation increases
   ↓
5. LEADERBOARD → Rankings update
   ↓
6. CULTURE → Positive reinforcement spreads
```

## Reputation Examples

### Rising Star:
```
User: Alice
Props Received: 15
Rank: #25
Recent Props:
- "Great presentation!" - Bob
- "Helpful in chat" - Carol
- "Thanks for the code review" - Dave
```

### Community Leader:
```
User: Bob
Props Received: 150
Rank: #3
Top Giver: Yes (given 200 props)
Status: Squad Legend 🌟
```

### New Member:
```
User: Charlie
Props Received: 3
Rank: #100+
Recent Props:
- "Welcome to the community!" - Alice
- "Good first question" - Bob
```

## Common Patterns

### Daily Recognition
```clarity
;; Give props to someone who helped you today
(contract-call? .squad-props give-props 
  'ST1HELPER
  "Thanks for the help today!"
)

;; Check your stats
(contract-call? .squad-props get-props-received tx-sender)
```

### Weekly Roundup
```clarity
;; Give props to top contributors this week
(contract-call? .squad-props give-multiple-props 'ST1USER1 u5 "Great week!")
(contract-call? .squad-props give-multiple-props 'ST1USER2 u3 "Nice work!")
(contract-call? .squad-props give-multiple-props 'ST1USER3 u2 "Keep it up!")
```

### Check Before Giving
```clarity
;; See if you've already given props to someone
(contract-call? .squad-props has-given-props-to 
  tx-sender
  'ST1USER
)

;; Give props if you haven't yet
(contract-call? .squad-props give-props 
  'ST1USER
  "Overdue recognition!"
)
```

### Track Your Impact
```clarity
;; See how many props you've given
(contract-call? .squad-props get-props-given tx-sender)

;; See how many you've received
(contract-call? .squad-props get-props-received tx-sender)

;; Check your rank
(contract-call? .squad-props get-user-rank tx-sender)
```

## Props Message Ideas

**For Help:**
- "Thanks for helping me debug!"
- "Your explanation was super clear"
- "Saved me hours of work!"

**For Quality Work:**
- "Amazing code quality 🚀"
- "This feature is fantastic"
- "Best documentation I've seen"

**For Community:**
- "Always helpful in chat"
- "Great community vibe"
- "Makes everyone feel welcome"

**For Leadership:**
- "Excellent meeting facilitation"
- "Great vision and direction"
- "Inspiring leadership"

**For Creativity:**
- "Brilliant idea!"
- "Creative solution"
- "Thinking outside the box"

## Deployment

### Testnet
```bash
clarinet deployments generate --testnet --low-cost
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### Mainnet
```bash
clarinet deployments generate --mainnet
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

## Roadmap

- [ ] Write the core contract
- [ ] Add comprehensive tests
- [ ] Deploy to testnet
- [ ] Add props categories (helpful, creative, leader, etc.)
- [ ] Implement props decay (optional)
- [ ] Add props badges/NFTs for milestones
- [ ] Support props reactions (👍, ❤️, 🚀)
- [ ] Create props analytics dashboard
- [ ] Add team/group props tracking

## Advanced Features (Future)

**Props Categories:**
- 🎯 Helpful Props
- 💡 Creative Props
- 👑 Leadership Props
- 🚀 Innovation Props
- 🤝 Collaboration Props

**Milestone Badges:**
- 10 Props: Rising Star ⭐
- 50 Props: Community Hero 🦸
- 100 Props: Squad Legend 🌟
- 500 Props: Hall of Fame 🏆

**Analytics:**
- Props over time graph
- Top givers/receivers
- Category breakdown
- Team statistics
- Engagement metrics

**Social Features:**
- Follow top contributors
- Props notifications
- Monthly highlights
- Anniversary celebrations
- Trending props

**Gamification:**
- Streaks (give props daily)
- Challenges (give 10 props this week)
- Achievements
- Leaderboard seasons
- Special events

## Security Features

- ✅ Cannot give props to yourself
- ✅ All props are public (transparency)
- ✅ Cannot delete or modify props
- ✅ Timestamp verification
- ✅ Spam prevention (cooldown optional)
- ✅ Immutable reputation history

## Best Practices

**Giving Props:**
- Be specific in messages
- Give props sincerely
- Don't over-inflate with multiple props
- Recognize promptly
- Be genuine and authentic

**Building Culture:**
- Give props regularly
- Recognize diverse contributions
- Lead by example
- Celebrate milestones
- Create props rituals

**Community Guidelines:**
- Props for positive contributions
- Meaningful messages
- Avoid props spam
- Be inclusive
- Spread the love

## Important Notes

⚠️ **Usage Guidelines:**
- Props are permanent (can't be removed)
- Be thoughtful with messages
- Props are public recognition
- Cannot give props to yourself

💡 **Cultural Tips:**
- Props create positive culture
- Recognition motivates people
- Small acknowledgments matter
- Build habits of appreciation
- Everyone loves recognition

🎯 **Impact:**
- Increases engagement
- Builds community bonds
- Motivates contribution
- Creates positive feedback loops
- Improves team morale

## Limitations

**Current Constraints:**
- Maximum 500 characters per message
- No props deletion
- Public only (no private props)
- Simple scoring (1 prop = 1 point)

**Design Choices:**
- Simplicity encourages use
- Public props build transparency
- Permanent record prevents gaming
- Free to give (just gas)

## Props Statistics

Track interesting metrics:
- Total props given
- Average props per user
- Most active givers
- Top receivers
- Props growth rate
- Community engagement score

## Leaderboard Tiers

### Top 10:
- Elite contributors
- Squad legends
- Highest reputation
- Most recognized

### Top 50:
- Active contributors
- Community heroes
- Regular recognizers
- Rising stars

### Top 100:
- Engaged members
- Helpful community
- Growing reputation
- Consistent contributors

## Community Ideas

**Props Rituals:**
- Monday motivation props
- Friday celebration props
- Monthly recognition ceremony
- Quarterly awards

**Team Events:**
- Props appreciation week
- Recognition challenges
- Milestone celebrations
- Anniversary props

**Incentives:**
- Top contributor rewards
- Milestone badges
- Special access
- Community spotlights

## Contributing

This is a learning project! Feel free to:
- Open issues for questions
- Submit PRs for improvements
- Fork and experiment
- Build positive communities

## License

MIT License - do whatever you want with it

## Resources

- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Clarinet Documentation](https://github.com/hirosystems/clarinet)
- [Stacks Blockchain](https://www.stacks.co/)
- [Social Token Patterns](https://book.clarity-lang.org/)

---

Built while learning Clarity 🙌

## Motivational Quotes

"Appreciation can make a day, even change a life. Your willingness to put it into words is all that is necessary." - Margaret Cousins

"Recognition is the greatest motivator." - Gerard C. Eakedale

Give props. Build culture. Celebrate your squad. 💪

---

**Your Stats:**
- Props Received: ???
- Props Given: ???
- Rank: ???
- Impact Score: ???

**Who deserves props today?** 🌟
