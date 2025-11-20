import { gql } from "@apollo/client";

export const GET_EVENTS_FOR_CALENDAR = gql`
	query GetUsersEventsForCalendar {
		getUsersEvents {
			id
			title
			description
			location
			startTime
			endTime
			attendees {
				username
			}
		}
	}
`;

export const GET_EVENT = gql`
	query GetEvent($eventID: ID!) {
		getEvent(id: $eventID) {
			id
			title
			description
			location
			startTime
			endTime
			createdBy {
				username
				id
			}
			attendees {
				username
			}
		}
	}
`;

export const GET_USER = gql`
	query GetUser($userID: ID!) {
		getUser(id: $userID) {
			id
			username
			email
			firstName
			lastName
		}
	}
`;
