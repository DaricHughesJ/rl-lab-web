export type LaunchSurveyAnswers = {
  play_frequency: 'Daily' | 'Several times a week' | 'About once a week' | 'Less often'
  player_level: 'New or returning' | 'Casual' | 'Competitive' | 'High-ranked or highly experienced' | 'Prefer not to say'
  mechanic_interests: Array<'Fast Aerial' | 'Air Dribble' | 'Flip Reset' | 'Wave Dash' | 'Half Flip' | 'Other'>
  product_clarity: 'Very clear' | 'Mostly clear' | 'Somewhat unclear' | 'Very unclear'
  product_description: string
  setup_ease: 'Very easy' | 'Easy' | 'Neither easy nor difficult' | 'Difficult' | 'Very difficult' | 'I could not get started'
  setup_surprises: string
  feedback_usefulness: 'Extremely useful' | 'Very useful' | 'Somewhat useful' | 'Slightly useful' | 'Not useful' | 'I did not get feedback'
  feedback_clarity: 'Very easy' | 'Mostly easy' | 'Sometimes confusing' | 'Often confusing' | 'I did not get feedback'
  detection_accuracy: 'Almost always' | 'Usually' | 'About half the time' | 'Rarely' | 'Not sure / did not try enough'
  worked_well: string
  frustrations: string
  issues: string
  continued_use: 'Definitely' | 'Probably' | 'Not sure' | 'Probably not' | 'Definitely not'
  recommendation: '0 · Not at all likely' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10 · Extremely likely'
  recommendation_reason: string
  next_feature: 'More mechanics' | 'More accurate attempt detection' | 'Clearer coaching' | 'Progress tracking over time' | 'Replay or session review' | 'Easier installation and updates' | 'Other'
  retest: 'Yes' | 'Maybe' | 'No'
  anything_else: string
}

export type LaunchSurveyForm = {
  play_frequency: LaunchSurveyAnswers['play_frequency'] | ''
  player_level: LaunchSurveyAnswers['player_level'] | ''
  mechanic_interests: LaunchSurveyAnswers['mechanic_interests']
  product_clarity: LaunchSurveyAnswers['product_clarity'] | ''
  product_description: string
  setup_ease: LaunchSurveyAnswers['setup_ease'] | ''
  setup_surprises: string
  feedback_usefulness: LaunchSurveyAnswers['feedback_usefulness'] | ''
  feedback_clarity: LaunchSurveyAnswers['feedback_clarity'] | ''
  detection_accuracy: LaunchSurveyAnswers['detection_accuracy'] | ''
  worked_well: string
  frustrations: string
  issues: string
  continued_use: LaunchSurveyAnswers['continued_use'] | ''
  recommendation: LaunchSurveyAnswers['recommendation'] | ''
  recommendation_reason: string
  next_feature: LaunchSurveyAnswers['next_feature'] | ''
  retest: LaunchSurveyAnswers['retest'] | ''
  anything_else: string
}
