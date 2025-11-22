-- Update Wender tool data
UPDATE public.ai_tools
SET 
  description = 'Design as fast as you think - Make prototypes, mockups, and presentations in seconds with AI.',
  full_description = 'Wender is the fastest way to design anything. Type what you want to see and it''s done in seconds. Have an app already? Upload a screenshot, ask Wender to add a feature or redesign it, and get a mockup ready to share in Slack or real code to share with your engineers. Want to make a presentation? You can use Present Mode to show off your ideas right inside Wender. RIP Google Slides.',
  website_url = 'http://app.wenderapp.com/'
WHERE slug = 'wender' OR name ILIKE 'wender';
