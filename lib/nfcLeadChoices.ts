// Same choices as the "NFC Card Sales - Lead Intake" Google Form, whose responses
// fill columns A:O of the tracker sheet. Shared by the form page and its API route.
export const PURCHASED = ['Yes', 'No'];
export const OPEN_TO_AUDIT = ['Yes', 'No', 'Maybe later'];
export const FOLLOW_UP = ['Yes', 'No'];

// How the stop went. Not on the Google Form; it sets the lead's status and first
// follow-up in the tracking columns (P:U).
export const VISIT_RESULTS = ['Talked to owner', 'Owner not in', 'Not interested'];
