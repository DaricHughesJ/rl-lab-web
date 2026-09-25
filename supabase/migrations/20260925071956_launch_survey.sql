create table public.launch_survey_responses (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null,
  submitted_at timestamptz not null default now(),
  constraint launch_survey_answers_object check (jsonb_typeof(answers) = 'object'),
  constraint launch_survey_answers_size check (octet_length(answers::text) <= 16000),
  constraint launch_survey_answers_fields check (
    answers ?& array[
      'play_frequency', 'player_level', 'mechanic_interests', 'product_clarity',
      'product_description', 'setup_ease', 'setup_surprises', 'feedback_usefulness',
      'feedback_clarity', 'detection_accuracy', 'worked_well', 'frustrations',
      'issues', 'continued_use', 'recommendation', 'recommendation_reason',
      'next_feature', 'retest', 'anything_else'
    ]
    and answers - array[
      'play_frequency', 'player_level', 'mechanic_interests', 'product_clarity',
      'product_description', 'setup_ease', 'setup_surprises', 'feedback_usefulness',
      'feedback_clarity', 'detection_accuracy', 'worked_well', 'frustrations',
      'issues', 'continued_use', 'recommendation', 'recommendation_reason',
      'next_feature', 'retest', 'anything_else'
    ] = '{}'::jsonb
  ),
  constraint launch_survey_required_choices check (
    jsonb_typeof(answers->'play_frequency') = 'string'
    and jsonb_typeof(answers->'player_level') = 'string'
    and jsonb_typeof(answers->'product_clarity') = 'string'
    and jsonb_typeof(answers->'setup_ease') = 'string'
    and jsonb_typeof(answers->'feedback_usefulness') = 'string'
    and jsonb_typeof(answers->'feedback_clarity') = 'string'
    and jsonb_typeof(answers->'detection_accuracy') = 'string'
    and jsonb_typeof(answers->'continued_use') = 'string'
    and jsonb_typeof(answers->'recommendation') = 'string'
    and jsonb_typeof(answers->'next_feature') = 'string'
    and jsonb_typeof(answers->'retest') = 'string'
    and
    answers->>'play_frequency' = any (array['Daily', 'Several times a week', 'About once a week', 'Less often'])
    and answers->>'player_level' = any (array['New or returning', 'Casual', 'Competitive', 'High-ranked or highly experienced', 'Prefer not to say'])
    and jsonb_typeof(answers->'mechanic_interests') = 'array'
    and jsonb_array_length(answers->'mechanic_interests') > 0
    and answers->'mechanic_interests' <@ '["Fast Aerial", "Air Dribble", "Flip Reset", "Wave Dash", "Half Flip", "Other"]'::jsonb
    and answers->>'product_clarity' = any (array['Very clear', 'Mostly clear', 'Somewhat unclear', 'Very unclear'])
    and answers->>'setup_ease' = any (array['Very easy', 'Easy', 'Neither easy nor difficult', 'Difficult', 'Very difficult', 'I could not get started'])
    and answers->>'feedback_usefulness' = any (array['Extremely useful', 'Very useful', 'Somewhat useful', 'Slightly useful', 'Not useful', 'I did not get feedback'])
    and answers->>'feedback_clarity' = any (array['Very easy', 'Mostly easy', 'Sometimes confusing', 'Often confusing', 'I did not get feedback'])
    and answers->>'detection_accuracy' = any (array['Almost always', 'Usually', 'About half the time', 'Rarely', 'Not sure / did not try enough'])
    and answers->>'continued_use' = any (array['Definitely', 'Probably', 'Not sure', 'Probably not', 'Definitely not'])
    and answers->>'recommendation' = any (array['0 · Not at all likely', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 · Extremely likely'])
    and answers->>'next_feature' = any (array['More mechanics', 'More accurate attempt detection', 'Clearer coaching', 'Progress tracking over time', 'Replay or session review', 'Easier installation and updates', 'Other'])
    and answers->>'retest' = any (array['Yes', 'Maybe', 'No'])
  ),
  constraint launch_survey_comment_lengths check (
    jsonb_typeof(answers->'product_description') = 'string' and length(answers->>'product_description') <= 1500
    and jsonb_typeof(answers->'setup_surprises') = 'string' and length(answers->>'setup_surprises') <= 1500
    and jsonb_typeof(answers->'worked_well') = 'string' and length(answers->>'worked_well') <= 1500
    and jsonb_typeof(answers->'frustrations') = 'string' and length(answers->>'frustrations') <= 1500
    and jsonb_typeof(answers->'issues') = 'string' and length(answers->>'issues') <= 1500
    and jsonb_typeof(answers->'recommendation_reason') = 'string' and length(answers->>'recommendation_reason') <= 1500
    and jsonb_typeof(answers->'anything_else') = 'string' and length(answers->>'anything_else') <= 1500
  )
);

alter table public.launch_survey_responses enable row level security;

create policy "Users can read their own launch survey response"
  on public.launch_survey_responses for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can submit one launch survey response"
  on public.launch_survey_responses for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.launch_survey_responses from anon, public;
grant select, insert on public.launch_survey_responses to authenticated;
