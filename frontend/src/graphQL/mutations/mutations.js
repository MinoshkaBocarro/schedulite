import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
	mutation Login($input: LoginUserInput!) {
		loginUser(input: $input) {
			id
			username
			email
			firstName
			lastName
			token
		}
	}
`;
export const CREATE_USER = gql`
	mutation CreateUser($input: CreateUserInput!) {
		createUser(input: $input) {
			id
			username
			token
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($updateUserID: ID!, $input: UpdateUserInput!) {
		updateUser(id: $updateUserID, input: $input) {
			id
			username
			email
			firstName
			lastName
			token
		}
	}
`;

export const DELETE_USER = gql`
	mutation DeleteUser($userID: ID!) {
		deleteUser(id: $userID) {
			id
			username
			email
			firstName
			lastName
		}
	}
`;

export const CREATE_EVENT = gql`
	mutation CreateEvent($input: CreateEventInput!) {
		createEvent(input: $input) {
			id
			title
			description
			location
			startTime
			endTime
			createdBy {
				username
			}
			attendees {
				username
			}
		}
	}
`;

export const UPDATE_EVENT = gql`
	mutation UpdateEvent($updateEventID: ID!, $input: UpdateEventInput!) {
		updateEvent(id: $updateEventID, input: $input) {
			id
			title
			description
			location
			startTime
			endTime
			createdBy {
				username
			}
			attendees {
				username
			}
		}
	}
`;

export const DELETE_EVENT = gql`
	mutation DeleteEvent($eventID: ID!) {
		deleteEvent(id: $eventID) {
			id
			title
			description
			location
			startTime
			endTime
			createdBy {
				username
			}
			attendees {
				username
			}
		}
	}
`;
