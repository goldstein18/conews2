import { gql } from "@apollo/client";

// Get company notes
export const GET_COMPANY_NOTES = gql`
  query GetCompanyNotes($companyId: String!) {
    getCompanyNotes(companyId: $companyId)
  }
`;

// Add a new note to a company
export const ADD_COMPANY_NOTE = gql`
  mutation AddCompanyNote(
    $companyId: String!
    $note: String!
    $author: String
  ) {
    addCompanyNote(
      companyId: $companyId
      addNoteInput: {
        note: $note
        author: $author
      }
    ) {
      id
      name
      notes
      updatedAt
    }
  }
`;

// Update/replace all company notes
export const UPDATE_COMPANY_NOTES = gql`
  mutation UpdateCompanyNotes(
    $companyId: String!
    $notes: String!
  ) {
    updateCompanyNotes(
      companyId: $companyId
      updateNotesInput: {
        notes: $notes
      }
    ) {
      id
      name
      notes
      updatedAt
    }
  }
`;

// Get company with notes included
export const GET_COMPANY_WITH_NOTES = gql`
  query GetCompanyWithNotes($companyId: String!) {
    company(id: $companyId) {
      id
      name
      email
      notes
      status
      owner {
        firstName
        lastName
      }
      updatedAt
    }
  }
`;