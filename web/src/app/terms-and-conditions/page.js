"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function TermsAndConditions() {
  const [mounted, setMounted] = useState(false);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-300 p-6 sm:p-12 md:p-20 lg:p-24 flex flex-col items-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Navbar />

      {/* Page Title */}
      <motion.h1
        className="text-6xl font-extrabold text-white mt-20 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 tracking-wide drop-shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Terms & Conditions
      </motion.h1>

      <motion.p
        className="text-xl text-gray-400 text-left max-w-3xl leading-relaxed font-light mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        Welcome to Instagram Clone. Please take a moment to review our guidelines and policies. Your continued use of this platform implies agreement to the following terms.
      </motion.p>

      {/* Left Side (Info Sections) */}
      <motion.div
        className="hidden lg:flex flex-col absolute left-10 top-40 space-y-6 w-72"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {infoSections.map((section, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 bg-opacity-40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 transition-transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
            <p className="text-gray-400 text-sm">{section.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Right Side (Quick Navigation) - Fixed Center */}
      <motion.div
        className="hidden lg:flex flex-col fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-40 backdrop-blur-md p-6 rounded-l-xl shadow-xl border border-gray-700 w-64"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Quick Navigation</h3>
        {termsList.map((term, index) => (
          <motion.a
            key={index}
            href={`#section${index + 1}`}
            className="text-gray-400 hover:text-white hover:scale-105 transition-transform duration-200 py-1"
            whileHover={{ scale: 1.1 }}
          >
            {index + 1}. {term.title}
          </motion.a>
        ))}
      </motion.div>

      {/* Terms Sections */}
      <motion.div className="w-full max-w-3xl space-y-6">
        {termsList.map((term, index) => (
          <motion.div
            key={index}
            className="p-5 bg-gray-800 rounded-xl shadow-lg cursor-pointer border border-gray-700 backdrop-blur-lg flex flex-col transition-transform transform hover:scale-[1.02]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onClick={() => toggleSection(index)}
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-200 text-lg font-semibold" id={`section${index + 1}`}>
                {index + 1}. {term.title}
              </p>
              <motion.div animate={{ rotate: openSections[index] ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {openSections[index] ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </motion.div>
            </div>
            {openSections[index] && (
              <motion.p
                className="mt-3 text-gray-400 text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                {term.description}
              </motion.p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Left Side Sections
const infoSections = [
    { title: "Know Your Rights", description: "Understanding our terms helps protect your rights. Read about privacy, security, and compliance." },
    { title: "Privacy & Security", description: "We prioritize your safety. Learn how we protect your data and what you can do to stay secure." },
    { title: "Content Guidelines", description: "Ensure your posts follow our policies. Avoid hate speech, harassment, or illegal content." },
    { title: "Reporting & Support", description: "Facing issues? Report content violations or contact our support team for help." },
    { title: "Community Standards", description: "Learn about the values and guidelines that shape our platform and ensure a positive environment." },
    { title: "Terms of Service", description: "Review the legal agreements you accept by using our platform, including user responsibilities and limitations." },
    { title: "User Responsibilities", description: "Understand your obligations as a user, including ethical behavior, content ownership, and compliance." },
    { title: "Moderation Policies", description: "See how we enforce our guidelines, handle content violations, and apply moderation decisions." },
    { title: "Appeals & Disputes", description: "If you believe a moderation decision was unfair, learn how to submit an appeal or resolve disputes." },
    { title: "Account Suspension & Bans", description: "Understand why accounts get suspended or banned and what steps you can take to appeal." },
    { title: "Data Collection & Usage", description: "Learn what data we collect, how we use it, and how you can control your personal information." },
    { title: "Cookie Policy", description: "Understand how we use cookies and similar technologies to enhance your experience." },
    { title: "Advertising & Sponsorships", description: "Discover our policies on advertisements, sponsorships, and branded content." },
    { title: "Intellectual Property", description: "Know how copyrights, trademarks, and intellectual property rights apply to content on our platform." },
    { title: "Third-Party Services", description: "Learn how integrations and third-party services interact with our platform and what data they access." },
    { title: "Age Restrictions", description: "Check the minimum age requirements and content access limitations for different age groups." },
    { title: "Parental Controls", description: "Understand how parents and guardians can monitor and control their child's experience on our platform." },
    { title: "Payment & Refund Policies", description: "Review our policies on transactions, billing, and refund requests." },
    { title: "Subscription & Cancellation", description: "Learn how to manage your subscriptions, auto-renewals, and cancellations." },
    { title: "User Content Rights", description: "Find out who owns the content you create and how we may use it on our platform." },
    { title: "Prohibited Activities", description: "Read about actions that violate our policies, including fraud, spam, and harassment." },
    { title: "Automated Systems & Bots", description: "Understand our policies on automated accounts, bots, and AI-generated content." },
    { title: "Security Breaches & Incidents", description: "See how we handle security breaches and what steps we take to protect users." },
    { title: "Law Enforcement Requests", description: "Learn how we respond to government and law enforcement data requests." },
    { title: "Accessibility & Inclusion", description: "Find out how we ensure an accessible and inclusive experience for all users." },
    { title: "API & Developer Policies", description: "Explore our API terms and guidelines for developers building integrations." },
    { title: "Content Monetization", description: "Learn about revenue-sharing models, monetization eligibility, and payment structures." },
    { title: "Fake News & Misinformation", description: "Understand how we tackle fake news, deepfakes, and misleading information." },
    { title: "Hate Speech & Harassment", description: "Read about our zero-tolerance policy on hate speech, threats, and abusive behavior." },
    { title: "Marketplace Rules", description: "If our platform has a marketplace, review policies on selling, transactions, and disputes." },
    { title: "Gaming & Esports Policies", description: "Learn about regulations related to gaming content, in-game purchases, and esports." },
    { title: "Crowdfunding & Donations", description: "Understand how crowdfunding and donation-related activities are managed on our platform." },
    { title: "Environmental Responsibility", description: "Find out how we promote sustainability and environmentally friendly policies." },
    { title: "Workplace & Employee Policies", description: "Read about ethical guidelines, workplace conduct, and corporate policies." },
    { title: "International Compliance", description: "Ensure your activities align with global regulations and international laws." },
    { title: "Health & Safety", description: "Check our policies on promoting health and wellness in content and interactions." },
    { title: "Algorithm & Recommendation System", description: "Learn how our recommendation algorithms work and how content is ranked." },
    { title: "AI & Machine Learning Ethics", description: "Understand how AI is used on our platform and our commitment to ethical AI usage." },
    { title: "Changes to Policies", description: "Stay updated on changes to our terms and policies and how they affect you." },
  
    // Additional 40 Sections
    { title: "User Behavior Tracking", description: "Learn how we monitor user behavior to improve experience and enforce policies." },
    { title: "Dark Patterns & Deceptive Design", description: "Read how we ensure fair design and avoid manipulative UI elements." },
    { title: "Phishing & Scam Prevention", description: "Protect yourself from online scams and phishing attempts." },
    { title: "Data Portability & Export", description: "Understand how you can export your data and move it elsewhere." },
    { title: "Personalized Ads & Opt-Out", description: "Control your ad preferences and opt out of personalized ads." },
    { title: "Deepfake & AI-Generated Content", description: "See how we regulate AI-generated and deepfake content." },
    { title: "Fake Reviews & Manipulated Ratings", description: "Discover how we prevent and detect fake reviews." },
    { title: "Two-Factor Authentication (2FA)", description: "Enable extra security by setting up two-factor authentication." },
    { title: "Online Stalking & Cyberbullying", description: "Understand how we prevent cyberstalking and harassment." },
    { title: "Data Breach Notifications", description: "Know how we inform users about data breaches and security risks." },
    { title: "Geolocation & Tracking Permissions", description: "Find out when and how your location data is used." },
    { title: "Multi-Account Policies", description: "Review rules regarding multiple accounts and sockpuppeting." },
    { title: "AI Moderation & Human Review", description: "How we balance AI moderation with human oversight." },
    { title: "Piracy & Copyright Violations", description: "Understand how we handle copyrighted material violations." },
    { title: "Bug Bounty Program", description: "Report security vulnerabilities and earn rewards." },
    { title: "Blockchain & Crypto Policies", description: "Guidelines for blockchain and crypto-related activities." },
    { title: "Digital Legacy & Account Inheritance", description: "What happens to your account after death?" },
    { title: "Censorship & Free Speech", description: "Learn where we draw the line between moderation and free speech." },
    { title: "Dark Web & Illicit Activities", description: "How we prevent illegal activities linked to the dark web." },
    { title: "Ethical AI Use", description: "How we use AI responsibly and mitigate bias." },
    { title: "Smart Contracts & Decentralized Apps", description: "Understand our stance on blockchain-based apps." },
    { title: "Government Censorship Requests", description: "How we handle government content removal requests." },
    { title: "User Behavior Analytics", description: "How we analyze data to improve the platform." },
    { title: "AI Ethics & Fairness", description: "How we ensure AI models are unbiased and ethical in decision-making." },
    { title: "Biometric Data Usage", description: "Understand how facial recognition and fingerprint data are handled." },
    { title: "Cloud Storage & Data Retention", description: "How long we store your data and how you can request its deletion." },
    { title: "Influencer & Sponsored Content", description: "Rules for influencers and businesses collaborating on our platform." },
    { title: "Dark Mode & Accessibility Features", description: "Customize your experience with themes and accessibility tools." },
    { title: "Real-Time Moderation", description: "Learn how we monitor live streams, chats, and comments in real-time." },
    { title: "GDPR & Data Compliance", description: "Your rights under the General Data Protection Regulation (GDPR)." },
    { title: "Neural Network-Based Filtering", description: "How AI filters content using deep learning models." },
    { title: "Cross-Platform Data Sharing", description: "Policies on sharing data across apps, services, and partners." },
    { title: "User Anonymity & Identity Protection", description: "How we allow anonymous browsing while protecting identities." }
  
  ];
  

// Terms List
const termsList = [
    { title: "Users must be 13 years or older to register.", description: "To ensure a safe environment, users under 13 are not permitted to use this platform." },
    { title: "No posting of illegal, defamatory, or harmful content.", description: "Content violating laws or harmful to individuals will be removed, and violators may face action." },
    { title: "Users are responsible for keeping their accounts secure.", description: "Use strong passwords and enable two-factor authentication to protect your account." },
    { title: "Hate speech, bullying, and harassment are strictly prohibited.", description: "We encourage a positive and inclusive community. Harassment of any form is not tolerated." },
    { title: "Spamming, misleading content, and scams are not allowed.", description: "Accounts engaged in misleading activities or scams will be permanently banned." },
    { title: "Any violation may result in suspension or termination of the account.", description: "Repeated violations will lead to strict actions, including permanent bans." },
    { title: "Users should respect copyright laws when sharing content.", description: "Uploading copyrighted content without permission may lead to removal and penalties." },
    { title: "Personal data will be protected as per our Privacy Policy.", description: "Read our privacy policy to understand how we handle user data." },
    { title: "Advertisements must follow our ad policies.", description: "All advertisements should comply with our platform's advertising guidelines." },
    { title: "Fake profiles and impersonation are not allowed.", description: "Users found impersonating others will have their accounts removed immediately." },
    { title: "Unauthorized automation or bot activities are prohibited.", description: "The use of bots for engagement manipulation is not allowed." },
    { title: "Users are encouraged to report inappropriate content.", description: "Help us maintain a safe platform by reporting content that violates our policies." },
    { title: "Community guidelines must be followed at all times.", description: "Users are expected to adhere to community standards to ensure a positive experience." },
    { title: "Violation of terms can lead to legal consequences.", description: "Serious violations may result in legal actions beyond account suspension." },
    { title: "We reserve the right to update these terms periodically.", description: "Users should check for updates to stay informed about policy changes." },
    { title: "Users must not share sensitive personal information.", description: "Protect your privacy by avoiding the sharing of personal details publicly." },
    { title: "Moderators have the final say in disputes.", description: "All disputes regarding content or conduct will be resolved by platform moderators." },
    { title: "External links may not always be verified.", description: "We are not responsible for third-party content linked from our platform." },
    { title: "Users cannot engage in fraudulent transactions.", description: "Fraudulent activities such as fake giveaways and scams will result in account bans." },
    { title: "Do not misuse the reporting system.", description: "False reports against users or content can lead to penalties." },
    { title: "Unauthorized data scraping is prohibited.", description: "Users must not extract data from the platform using automated tools." },
    { title: "All financial transactions must be lawful.", description: "Users engaging in financial activities must comply with legal requirements." },
    { title: "Users must not exploit platform vulnerabilities.", description: "Reporting bugs is encouraged, but exploiting them is a violation of our terms." },
    { title: "Inactive accounts may be deactivated.", description: "Accounts that remain inactive for extended periods may be subject to deletion." },
    { title: "Political propaganda and extremist content are not allowed.", description: "Content promoting hate groups or extremist ideologies will be removed." },
    { title: "Users cannot sell or transfer their accounts.", description: "Account ownership is non-transferable and selling accounts is prohibited." },
    { title: "User-generated content remains the user's responsibility.", description: "Users are accountable for the content they share on the platform." },
    { title: "Do not impersonate the platform or its representatives.", description: "Falsely representing the platform is strictly forbidden." },
    { title: "Users must comply with local laws.", description: "Users are responsible for ensuring their actions comply with applicable laws." },
    { title: "Platform reserves the right to remove content at its discretion.", description: "Content may be removed if deemed inappropriate or non-compliant." },
    { title: "Users must not interfere with platform operations.", description: "Actions disrupting platform stability or functionality will be penalized." },
    { title: "Security breaches must be reported immediately.", description: "Users discovering security vulnerabilities must report them instead of exploiting them." },
    { title: "Personal attacks and threats are prohibited.", description: "Direct threats and personal attacks will result in immediate action." },
    { title: "Users should not engage in illegal file sharing.", description: "Sharing pirated content is against our policies and the law." },
    { title: "Users must not engage in doxxing.", description: "Publishing or sharing private information without consent is prohibited." },
    { title: "Moderation decisions are final.", description: "Users must respect the decisions made by moderators." },
    { title: "Failure to comply with these terms may lead to account suspension.", description: "Non-compliance with platform policies will result in disciplinary actions." },
    { title: "Users should respect the intellectual property of others.", description: "Unauthorized use of copyrighted materials is strictly prohibited." },
    { title: "Users must not misuse platform rewards.", description: "Abusing reward systems or referral programs will result in penalties." },
    { title: "Third-party plugins must be approved.", description: "Unauthorized extensions or plugins that alter platform functionality are prohibited." },
    { title: "Artificial intelligence-generated content must be disclosed.", description: "Users posting AI-generated content must explicitly disclose it to maintain transparency." },
    { title: "Do not use the platform for personal vendettas.", description: "Users must not use this platform to attack, defame, or harass individuals." },
    { title: "Explicit or adult content is restricted.", description: "Pornographic or sexually explicit material is not permitted." },
    { title: "Users must not exploit community trends for deception.", description: "Falsely promoting content as trending to mislead users is not allowed." },
    { title: "Phishing attempts will result in instant termination.", description: "Any attempt to steal login credentials through phishing is strictly prohibited." },
    { title: "Financial investments must follow legal compliance.", description: "Investment advice shared on the platform must comply with relevant laws and regulations." },
    { title: "Medical misinformation is strictly prohibited.", description: "Users must not share misleading or unverified medical advice." },
    { title: "Users must not evade bans with alternative accounts.", description: "Creating new accounts to bypass bans will lead to permanent removal." },
    { title: "Users must provide accurate personal details if required.", description: "Falsifying identity information may result in penalties." },
    { title: "Platform interactions should be constructive.", description: "Users must engage in discussions respectfully and avoid trolling." },
    { title: "Do not post repetitive or duplicate content.", description: "Spam or repetitive content may be removed without notice." },
    { title: "Users must not advertise products without permission.", description: "Promoting products without explicit approval is prohibited." },
    { title: "Self-harm encouragement will not be tolerated.", description: "Content encouraging or glorifying self-harm is strictly prohibited." },
    { title: "Language barriers must be respected.", description: "Users should use appropriate language settings and avoid offensive translations." },
    { title: "Do not interfere with official investigations.", description: "Users must cooperate with platform investigations if required." },
    { title: "Review bombing is prohibited.", description: "Mass downvoting or false reviews to manipulate ratings will not be tolerated." },
    { title: "Automated content moderation is subject to review.", description: "Decisions made by AI moderation can be appealed through human review." },
    { title: "Users must not solicit personal relationships.", description: "Unwanted romantic or personal advances toward others are not allowed." },
    { title: "Users should verify sources before sharing news.", description: "Spreading unverified news or misinformation will be penalized." },
    { title: "Multi-accounting for rewards is forbidden.", description: "Users must not create multiple accounts to gain unfair advantages in promotions." },
    { title: "Hoarding usernames is prohibited.", description: "Registering multiple usernames to block others from using them is against policy." },
    { title: "Editing platform content without consent is forbidden.", description: "Altering or tampering with published content without permission is prohibited." },
    { title: "External fundraising requires platform approval.", description: "Users must seek approval before soliciting donations on the platform." },
    { title: "Use of deepfake technology must be clearly labeled.", description: "Misleading deepfake content without disclosure is prohibited." },
    { title: "False emergency claims will be penalized.", description: "Users must not fabricate emergency situations for attention." },
    { title: "Data manipulation to evade moderation is prohibited.", description: "Editing posts or comments to avoid bans will result in removal." },
    { title: "Political endorsements require a disclaimer.", description: "Users promoting political content must disclose affiliations." },
    { title: "Language manipulation to bypass moderation is forbidden.", description: "Altering spelling or formatting to evade filters is not allowed." },
    { title: "Users must not engage in platform blackmail.", description: "Using the platform to threaten exposure or coercion is strictly forbidden." },
    { title: "Unverified giveaways are not allowed.", description: "Users hosting giveaways must prove legitimacy before promoting them." },
    { title: "Manipulating AI recommendations is against policy.", description: "Gaming recommendation algorithms unfairly is prohibited." },
    { title: "Users must not encourage piracy.", description: "Promotion of illegal downloads or piracy services is forbidden." },
    { title: "Public shaming of other users is not tolerated.", description: "Calling out or humiliating individuals in public posts is not permitted." },
    { title: "Users cannot claim false expertise.", description: "Impersonating professionals or experts to mislead others is against policy." },
    { title: "Unauthorized simulations of platform features are forbidden.", description: "Mimicking the platform's UI or functionalities externally is not allowed." },
    { title: "Users must not attempt to reidentify anonymized data.", description: "Revealing identities from anonymized information is against policy." },
    { title: "Users must log out from shared devices after use.", description: "To prevent unauthorized access, users should always log out from public or shared devices." },
    { title: "Content must be in accordance with community standards.", description: "All shared content must align with our ethical and community guidelines." },
    { title: "Users cannot request personal loans from others.", description: "The platform is not to be used for soliciting loans or borrowing money." },
    { title: "Explicit depictions of violence are not permitted.", description: "Gory, graphic, or disturbing violent content is strictly banned." },
    { title: "AI-generated reviews must be explicitly disclosed.", description: "Users posting AI-assisted reviews must state so clearly." },
    { title: "Engagement farming is not allowed.", description: "Artificially inflating interactions, such as likes and shares, is not permitted." },
    { title: "No manipulation of voting-based features.", description: "Users should not attempt to rig polls, votes, or feedback systems." },
    { title: "Posting real-time location of others is prohibited.", description: "Sharing someone’s live location without their consent is a serious violation." },
    { title: "Political fundraising without approval is forbidden.", description: "Users may not raise funds for political causes without explicit permission." },
    { title: "Users must not interfere with platform monetization.", description: "Attempting to bypass ads or block revenue streams is a violation." },
    { title: "Unauthorized resale of digital content is prohibited.", description: "Users may not resell platform-exclusive digital content for profit." },
    { title: "Spreading false claims about the platform is not allowed.", description: "Misrepresenting platform policies or features is strictly forbidden." },
    { title: "Manipulation of search rankings is prohibited.", description: "Users must not attempt to artificially boost content in search results." },
    { title: "Unauthorized use of VPNs to bypass restrictions is forbidden.", description: "Users must not use VPNs to access geo-restricted content unlawfully." },
    { title: "Do not misuse platform for illegal gambling.", description: "Unapproved gambling-related activities are strictly prohibited." },
    { title: "Users may not use the platform to recruit for external jobs.", description: "Recruiting users for external employment without permission is not allowed." },
    { title: "Fake or deceptive job postings are prohibited.", description: "Users may not post fraudulent job listings or mislead applicants." },
    { title: "Personalized harassment campaigns are banned.", description: "Coordinated attacks or organized harassment will lead to immediate suspension." },
    { title: "Disrupting public forums or Q&A sessions is not allowed.", description: "Users must engage in discussions respectfully without derailing conversations." },
    { title: "Surveillance-related content is highly restricted.", description: "Unauthorized sharing of surveillance footage or tracking information is prohibited." },
    { title: "Users cannot artificially inflate their follower count.", description: "Purchasing followers or using bots to increase engagement is not allowed." },
    { title: "Do not promote dangerous physical challenges.", description: "Encouraging unsafe stunts or life-threatening activities is strictly prohibited." },
    { title: "Misuse of emergency alert systems is a violation.", description: "Users must not create false emergency alerts or warnings." },
    { title: "Deceptive AI face swaps are not permitted.", description: "Deepfakes used to mislead or deceive others are against policy." },
    { title: "Use of burner accounts for deceptive purposes is forbidden.", description: "Users must not create temporary accounts to bypass platform restrictions." },
    { title: "Users may not exploit referral systems for personal gain.", description: "Abusing invite-based reward programs will result in disqualification." },
    { title: "Do not sell or trade virtual items for real money.", description: "Selling platform-generated digital goods for cash is not permitted." },
    { title: "Promoting counterfeit or replica products is prohibited.", description: "Users must not advertise or sell fake branded merchandise." },
    { title: "False claims about medical products will be removed.", description: "Users must not promote unverified medical treatments or false health claims." },
    { title: "Mass unsolicited friend requests are not allowed.", description: "Spamming connection requests to strangers violates platform rules." },
    { title: "Users must not create hoax or prank accounts.", description: "Fake accounts meant for pranks or deception will be banned." },
    { title: "Mass reporting of accounts to trigger bans is forbidden.", description: "Coordinated efforts to falsely report users will lead to action." },
    { title: "Harmful conspiracy theories will be moderated.", description: "Spreading proven misinformation or conspiracy theories is not allowed." },
    { title: "Altering timestamps or metadata to mislead is a violation.", description: "Users must not tamper with digital timestamps or logs." },
    { title: "Paid promotions must be disclosed clearly.", description: "Users engaging in paid promotions must indicate sponsorship transparently." },
    { title: "Repeated evasion of content filters will result in suspension.", description: "Users attempting to bypass moderation filters will face penalties." },
    { title: "Do not exploit accessibility features for advantage.", description: "Abusing closed captions or accessibility tools for unrelated purposes is not allowed." },
    { title: "Publicizing personal security vulnerabilities is prohibited.", description: "Users must report vulnerabilities privately instead of sharing publicly." },
    { title: "False claims of legal action against the platform will be penalized.", description: "Users falsely threatening lawsuits will be restricted." },
    { title: "No excessive use of animated effects that may cause harm.", description: "Avoid flashing images or animations that could trigger medical conditions." },
    { title: "Unauthorized brand partnerships are not allowed.", description: "Users must not falsely claim sponsorships or collaborations." },
    { title: "Do not create misleading thumbnails or previews.", description: "Clickbait tactics that mislead users will not be tolerated." },
    { title: "Content monetization abuse is not permitted.", description: "Users must not exploit monetization systems through artificial means." },
    { title: "Users cannot create or distribute hacking tools.", description: "Providing resources to compromise security is strictly forbidden." },
    { title: "Virtual protests and digital disruptions must be peaceful.", description: "Users organizing online protests must follow guidelines for safe participation." },
    { title: "No forced participation in external challenges or trends.", description: "Users should not be pressured into participating in viral challenges." },
    { title: "Do not manipulate timestamps to avoid content removal.", description: "Editing timestamps to evade moderation is not allowed." },
    { title: "Users must not solicit large-scale boycotts.", description: "Coordinated efforts to defame brands or individuals are prohibited." },
    { title: "Using AI voices to imitate real individuals requires disclosure.", description: "Mimicking someone's voice using AI must be labeled clearly." },
    { title: "Crowdsourcing personal information is a violation.", description: "Encouraging mass collection of private data is not permitted." },
    { title: "Satirical content must be clearly labeled as such.", description: "Fake news or satire must be explicitly marked to avoid confusion." },
    { title: "Uploading misleading edited screenshots is forbidden.", description: "Users must not manipulate screenshots to spread false claims." },
    { title: "Misleading ‘breaking news’ headlines are not allowed.", description: "Users must not frame non-urgent events as critical news." },
    { title: "Streaming unlicensed sports broadcasts is a violation.", description: "Unauthorized rebroadcasting of live events is strictly prohibited." },
    { title: "Selling used personal hygiene products is not allowed.", description: "Reselling hygiene or medical items poses health risks and is banned." },
    { title: "Users must not post paywalled content without permission.", description: "Reposting premium content from other sources is a violation." },
    { title: "AI-generated fake testimonials are prohibited.", description: "Endorsements must be genuine and not fabricated by AI." },
    { title: "Misrepresenting oneself as a victim for donations is a violation.", description: "Users must not create false hardship stories to gain financial support." }
  ];
  
