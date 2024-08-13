export interface Account {
  id: number; // Assuming 'id' is the primary key in your API response
  userId: string;
  ifsc: string;
  branchName: string;
  accountType: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  accountBalance: number; // Ensure this is consistent with your API response
}
