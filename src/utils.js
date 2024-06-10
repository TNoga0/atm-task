export function getAccBalance() {
    return (parseInt(localStorage.getItem('accountBalance') || '550'));
}

// Creates an initial object to be edited and returned when transaction Promise is resolved or rejected.
export function createInitialReturnObject() {
  return {
    operationSuccessful: false,
    banknotesUsed: {},
    balanceLeft: getAccBalance(), // Account balance left after the operation
    needInsert: false, // Indicates that the amount inserted was lower than the declared.
    needDeclarationFix: false, // Indicates that the amount inserted was higher than the declared.
    statusMessage: ''
  }
}