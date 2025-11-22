# Account Management Guide

This comprehensive guide covers everything you need to know about managing your Prompt Manage account, including creating accounts, signing in, and managing your data.

> **📘 User-Facing Documentation Available**
>
> This is the developer/technical documentation for account management. For user-friendly guides:
>
> - **[Complete Authentication Guide](/docs/authentication)** - Detailed sign-in guide for end users with troubleshooting
> - **[Main Documentation](/docs)** - Quick-start guides and how-tos
> - **[Getting Started](/docs/getting-started)** - Onboarding flow for new users

## 📝 Table of Contents

- [Creating an Account](#creating-an-account)
- [Signing In](#signing-in)
- [Viewing Your Profile](#viewing-your-profile)
- [Editing Your Profile](#editing-your-profile)
- [Viewing Public Prompts](#viewing-public-prompts)
- [Account Settings](#account-settings)
- [Data Management](#data-management)
- [Account Deletion](#account-deletion)
- [Privacy & Security](#privacy--security)
- [Troubleshooting](#troubleshooting)

## 🚀 Creating an Account

### Step 1: Access the Sign-Up Page

1. Navigate to [Prompt Manage](https://promptmanage.com)
2. Click the **"Sign Up"** button in the top-right corner
3. Or visit the sign-up page directly at `/auth/signup`

### Step 2: Choose Your Sign-Up Method

Prompt Manage offers multiple ways to create an account:

#### Option A: Email Sign-Up (Recommended)

1. Enter your email address
2. Click **"Send Verification Code"**
3. Check your email for a 6-digit verification code
4. Enter the code when prompted
5. Complete your profile setup

#### Option B: Google Sign-In

1. Click **"Continue with Google"**
2. Select your Google account
3. Grant necessary permissions
4. Complete your profile setup

### Step 3: Complete Your Profile

After verification, you'll be prompted to:

1. **Set your display name** (required)
2. **Add a bio** (optional)
3. **Set your website** (optional)
4. **Choose your preferences**:
   - Dark/Light mode preference
   - Email notifications
   - Analytics participation

### Step 4: Verify Your Account

- Check your email for a welcome message
- Verify your email address if prompted
- Complete any additional verification steps

## 🔐 Signing In

### Regular Sign-In Process

1. Go to [Prompt Manage](https://promptmanage.com)
2. Click **"Sign In"** in the top-right corner
3. Enter your email address
4. Click **"Send Verification Code"**
5. Check your email for the 6-digit code
6. Enter the code to sign in

### Google Sign-In

1. Click **"Continue with Google"**
2. Select your Google account
3. You'll be automatically signed in

### Troubleshooting Sign-In Issues

#### "Invalid verification code"

- **Solution**: Request a new code (codes expire after 10 minutes)
- **Prevention**: Check your spam folder for the email

#### "Account not found"

- **Solution**: Verify you're using the correct email address
- **Alternative**: Try signing up with a new account

#### "Too many attempts"

- **Solution**: Wait 15 minutes before trying again
- **Prevention**: Don't request multiple codes rapidly

## 👤 Viewing Your Profile

### Accessing Your Profile

#### Method 1: Through Navigation

1. Sign in to your account
2. Click your profile picture/avatar in the top-right corner
3. Select **"View Profile"** from the dropdown menu
4. Or navigate directly to `/profile`

#### Method 2: Direct URL

- Visit `https://promptmanage.com/profile` while signed in

### What You'll See on Your Profile

#### Profile Information

- **Display Name**: How your name appears to others
- **Bio**: Your personal or professional description
- **Website**: Your personal or professional website
- **Join Date**: When you created your account
- **Location**: Your general location (if set)

#### Activity Overview

- **Total Prompts**: Number of prompts you've created
- **Public Prompts**: Number of prompts visible to others
- **Private Prompts**: Number of prompts only you can see
- **Last Active**: When you were last active on the platform

#### Public Prompts Section

- **Recently Created**: Your latest public prompts
- **Most Popular**: Your prompts with the most views/likes
- **All Public Prompts**: Complete list of your public content

### Profile Visibility Settings

#### Public Profile

- **Visible to everyone**: Anyone can see your profile
- **Searchable**: Your profile appears in user searches
- **Social features**: Others can follow your public prompts

#### Private Profile

- **Only you can see**: Profile is not visible to others
- **Not searchable**: Won't appear in user searches
- **Limited social features**: Reduced interaction options

## ✏️ Editing Your Profile

### Accessing Profile Settings

#### Method 1: Through Profile Page

1. Go to your profile page (`/profile`)
2. Click the **"Edit Profile"** button
3. Make your changes
4. Click **"Save Changes"**

#### Method 2: Through Settings

1. Go to **Settings** (`/settings`)
2. Click on **"Profile"** in the sidebar
3. Edit your information
4. Click **"Save Changes"**

### What You Can Edit

#### Personal Information

- **Display Name**:
  - How your name appears to other users
  - Can be changed at any time
  - Must be between 2-50 characters
  - Cannot contain special characters or profanity

- **Bio**:
  - Brief description about yourself
  - Maximum 500 characters
  - Supports basic formatting (line breaks)
  - Can include links to your work

- **Website**:
  - Your personal or professional website
  - Must be a valid URL
  - Will be displayed as a clickable link
  - Optional field

- **Location**:
  - Your general location (city, country)
  - Helps others find local users
  - Optional field
  - Can be as specific or general as you prefer

#### Profile Preferences

- **Profile Visibility**:
  - Choose between public or private
  - Public: visible to everyone
  - Private: only you can see

- **Show Activity Status**:
  - Display when you're online
  - Helps others know when you're active
  - Can be disabled for privacy

### Profile Picture Management

#### Adding a Profile Picture

1. Go to **Settings** → **Profile**
2. Click on the profile picture area
3. Upload an image file (JPG, PNG, GIF)
4. Crop/resize as needed
5. Click **"Save"**

#### Profile Picture Requirements

- **File size**: Maximum 5MB
- **Dimensions**: Recommended 400x400 pixels
- **Formats**: JPG, PNG, GIF supported
- **Content**: Must be appropriate and not copyrighted

#### Removing Profile Picture

1. Go to **Settings** → **Profile**
2. Click **"Remove Picture"**
3. Confirm removal
4. Default avatar will be used

### Profile Customization

#### Theme Preferences

- **Light Mode**: Clean, bright interface
- **Dark Mode**: Dark interface for low-light use
- **System**: Automatically matches your device setting

#### Language Settings

- **English**: Default language
- **Additional languages**: Available based on your region
- **Interface language**: Affects menus and buttons
- **Content language**: Affects prompt suggestions

## 🌐 Viewing Public Prompts

### Accessing the Public Directory

#### Method 1: Through Navigation

1. Sign in to your account
2. Click **"Explore"** in the top navigation
3. Or navigate directly to `/p`

#### Method 2: Direct URL

- Visit `https://promptmanage.com/p` while signed in

### Browsing Public Prompts

#### Featured Prompts

- **Trending**: Most popular prompts this week
- **Recently Added**: Latest prompts from the community
- **Editor's Choice**: Curated high-quality prompts
- **Popular Categories**: Most active prompt categories

#### Search and Filter Options

- **Search Bar**: Search by prompt name, description, or tags
- **Category Filter**: Filter by prompt type (Marketing, Coding, Writing, etc.)
- **Model Filter**: Filter by AI model (GPT-4, Claude, Gemini, etc.)
- **Tag Filter**: Filter by specific tags
- **Sort Options**: Sort by date, popularity, or relevance

#### Prompt Cards Display

Each prompt card shows:

- **Prompt Name**: Title of the prompt
- **Description**: Brief description of what the prompt does
- **Author**: Who created the prompt
- **Model**: Which AI model it's designed for
- **Tags**: Relevant categories and keywords
- **Usage Count**: How many times it's been used
- **Rating**: Community rating (if available)

### Viewing Individual Prompts

#### Clicking on a Prompt

1. Click on any prompt card
2. View the full prompt content
3. See detailed information about the prompt
4. Access usage instructions

#### What You'll See

- **Full Prompt Text**: Complete prompt content
- **Usage Instructions**: How to use the prompt effectively
- **Author Information**: Creator's profile and other prompts
- **Related Prompts**: Similar prompts you might like
- **Comments**: Community feedback and tips
- **Usage Statistics**: How popular the prompt is

#### Interacting with Prompts

- **Copy Prompt**: Copy the prompt text to your clipboard
- **Save to Favorites**: Add to your personal favorites
- **Share**: Share the prompt with others
- **Report**: Report inappropriate content
- **Follow Author**: Follow the creator for updates

### Finding Specific Types of Prompts

#### By Category

- **Marketing**: Email campaigns, social media, ads
- **Content Creation**: Blog posts, articles, copywriting
- **Coding**: Code generation, debugging, documentation
- **Creative Writing**: Stories, poetry, scripts
- **Business**: Presentations, reports, analysis
- **Education**: Learning materials, explanations

#### By AI Model

- **GPT-4**: OpenAI's latest model
- **Claude**: Anthropic's AI assistant
- **Gemini**: Google's AI model
- **Custom Models**: Specialized or fine-tuned models

#### By Use Case

- **Professional**: Business and work-related prompts
- **Personal**: Individual productivity and creativity
- **Educational**: Learning and teaching prompts
- **Entertainment**: Fun and creative prompts

### Managing Your Public Prompts

#### Making Prompts Public

1. Go to **Dashboard** → **Prompts**
2. Click on a prompt to edit it
3. Toggle **"Make Public"** to ON
4. Add a description for the public directory
5. Save your changes

#### Public Prompt Requirements

- **Appropriate Content**: Must be suitable for all audiences
- **Clear Description**: Help others understand what it does
- **Proper Tags**: Use relevant tags for discoverability
- **No Sensitive Data**: Don't include personal or confidential information

#### Managing Public Visibility

- **Make Public**: Share with the community
- **Make Private**: Only you can see and use
- **Edit Description**: Update how it appears publicly
- **Update Tags**: Improve discoverability

## ⚙️ Account Settings

### Accessing Settings

1. Sign in to your account
2. Click your profile picture/avatar in the top-right corner
3. Select **"Settings"** from the dropdown menu
4. Or navigate directly to `/settings`

### Profile Settings

#### Personal Information

- **Display Name**: How your name appears to other users
- **Bio**: A brief description about yourself
- **Website**: Your personal or professional website
- **Location**: Your general location (optional)

#### Account Preferences

- **Theme**: Choose between light, dark, or system theme
- **Language**: Select your preferred language
- **Timezone**: Set your timezone for accurate timestamps

#### Notification Settings

- **Email Notifications**: Receive updates about your prompts
- **Marketing Emails**: Optional promotional content
- **Security Alerts**: Important account security notifications

### Privacy Settings

#### Data Processing

- **Analytics**: Help improve Prompt Manage by sharing anonymous usage data
- **Personalization**: Allow personalized content recommendations
- **Public Profile**: Control what information is visible to other users

#### Content Visibility

- **Public Prompts**: Make your prompts discoverable by others
- **Profile Visibility**: Control who can see your profile
- **Activity Status**: Show when you're online

## 📊 Data Management

### Understanding Your Data

Prompt Manage stores the following data for your account:

#### Personal Information

- Email address
- Display name and bio
- Profile preferences
- Account settings

#### Content Data

- All prompts you create
- Prompt versions and edit history
- Tags and categories
- Usage statistics

#### Activity Data

- Sign-in history
- Feature usage
- Performance metrics
- Error logs

### Exporting Your Data

#### Request Data Export

1. Go to **Settings** → **Legal & Privacy**
2. Scroll to **"Your Data Rights"** section
3. Click **"Request Export"**
4. You'll receive an email with download instructions
5. Download your data within 30 days

#### What's Included in Export

- All your prompts in JSON format
- Account information
- Usage statistics
- Settings and preferences

### Data Portability

#### Transferring to Another Service

1. Export your data using the steps above
2. Use the exported JSON files to import into other services
3. Contact support if you need assistance with specific formats

## 🗑️ Account Deletion

### ⚠️ Critical Warning

**Account deletion is permanent and irreversible. Please read this section carefully before proceeding.**

### What Happens When You Delete Your Account

#### Data That Will Be Permanently Lost

- **All your prompts** and their versions
- **Account settings** and preferences
- **Usage history** and statistics
- **Profile information** and bio
- **Public prompts** will be removed from the public directory
- **Subscriptions** and billing information
- **All associated data** stored on our servers

#### Data That Cannot Be Recovered

- **Prompt content** and versions
- **Personal settings** and customizations
- **Usage statistics** and history
- **Account relationships** and connections

### How to Delete Your Account

#### Method 1: Through Settings (Recommended)

1. Sign in to your account
2. Go to **Settings** → **Account**
3. Scroll to the **"Delete Account"** section
4. Click **"Delete Account"**
5. **Read the warning dialog carefully**
6. Confirm you understand the consequences
7. Click **"Yes, Delete My Account"**
8. Enter your password if prompted
9. Confirm deletion one final time

#### Method 2: Contact Support

1. Email **support@promptmanage.com**
2. Include your account email address
3. Request account deletion
4. Provide verification of account ownership
5. Wait for confirmation (within 48 hours)

### Before Deleting Your Account

#### Export Your Data First

1. **Always export your data** before deletion
2. **Save important prompts** to external files
3. **Download any public prompts** you want to keep
4. **Cancel subscriptions** if applicable

#### Alternative Options

- **Disable notifications** instead of deleting
- **Make prompts private** instead of deleting
- **Contact support** if you're having issues
- **Take a break** - accounts don't expire

### Account Deletion Process

#### Immediate Effects

- Account becomes inaccessible
- All prompts are marked for deletion
- Public prompts are removed from directory
- Billing is cancelled (if applicable)

#### Data Removal Timeline

- **Immediate**: Account access revoked
- **24 hours**: Public content removed
- **30 days**: Personal data deleted
- **90 days**: All traces removed from backups

#### Recovery Period

- **No recovery possible** after deletion
- **No grace period** for account restoration
- **Create new account** if you change your mind

## 🔒 Privacy & Security

### Data Protection

#### How We Protect Your Data

- **Encryption**: All data encrypted in transit and at rest
- **Access Controls**: Strict access controls and authentication
- **Regular Audits**: Security audits and vulnerability assessments
- **Compliance**: GDPR and CCPA compliant data handling

#### Your Privacy Rights

- **Right to Access**: View all data we have about you
- **Right to Rectification**: Correct inaccurate information
- **Right to Erasure**: Request data deletion
- **Right to Portability**: Export your data
- **Right to Object**: Opt out of certain data processing

### Security Best Practices

#### Account Security

- **Use a strong password** (if applicable)
- **Enable two-factor authentication** when available
- **Don't share your verification codes**
- **Sign out** from shared devices
- **Report suspicious activity** immediately

#### Data Security

- **Be careful with public prompts** - they're visible to everyone
- **Don't include sensitive information** in prompts
- **Regularly review** your privacy settings
- **Export data regularly** for backup

## 🆘 Troubleshooting

### Common Account Issues

#### "Can't sign in"

1. **Check your email** for verification codes
2. **Check spam folder** for emails
3. **Try a different browser** or incognito mode
4. **Clear browser cache** and cookies
5. **Contact support** if issues persist

#### "Account locked"

1. **Wait 15 minutes** before trying again
2. **Check email** for security notifications
3. **Contact support** if you believe it's an error

#### "Data missing"

1. **Check if you're signed in** to the correct account
2. **Look in different sections** of the dashboard
3. **Check if prompts are private** vs public
4. **Contact support** if data appears to be lost

#### "Can't delete account"

1. **Make sure you're signed in** to the correct account
2. **Try the support method** if settings don't work
3. **Check if you have active subscriptions** that need cancellation
4. **Contact support** for assistance

### Getting Help

#### Self-Service Options

- **Check this documentation** for common issues
- **Review our FAQ** section
- **Search our help center** for specific topics

#### Contact Support

- **Email**: support@promptmanage.com
- **Response Time**: Within 24 hours
- **Include**: Your email address and detailed description of the issue

#### Legal Inquiries

- **Email**: legal@promptmanage.com
- **Response Time**: Within 30 days
- **For**: Data deletion requests, privacy concerns, legal matters

## 📋 Quick Reference

### Important Links

- **Sign Up**: https://promptmanage.com/auth/signup
- **Sign In**: https://promptmanage.com/auth/signin
- **Settings**: https://promptmanage.com/settings
- **Privacy Policy**: https://promptmanage.com/privacy
- **Terms of Service**: https://promptmanage.com/terms

### Contact Information

- **General Support**: support@promptmanage.com
- **Legal Inquiries**: legal@promptmanage.com
- **Security Issues**: security@promptmanage.com

### Emergency Contacts

- **Account Compromise**: security@promptmanage.com
- **Data Breach Concerns**: privacy@promptmanage.com
- **Urgent Account Issues**: support@promptmanage.com (mark as urgent)

---

## ⚠️ Final Reminders

### Before You Delete Your Account

1. **Export all your data** - this is your only chance
2. **Save important prompts** to external files
3. **Cancel any subscriptions** to avoid charges
4. **Consider alternatives** like making prompts private
5. **Understand the consequences** - deletion is permanent

### Data Safety Tips

1. **Regular backups** - export your data monthly
2. **Be careful with public prompts** - they're visible to everyone
3. **Review privacy settings** regularly
4. **Keep your email updated** for important notifications
5. **Use strong security practices** for your account

### Need More Help?

- **Documentation**: Check our comprehensive guides
- **Community**: Join our user community for tips and support
- **Support**: Contact us directly for personalized assistance

---

_Last updated: January 2025_
_For the most current information, visit our help center at https://promptmanage.com/docs_
