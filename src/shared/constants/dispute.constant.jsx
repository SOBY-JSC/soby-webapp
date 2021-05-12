export const DisputeType = {
  PROCESSING: {
    name: 'Processing',
    colorClass: 'gray',
  },
  SATISFIED: {
    name: 'Accepted',
    colorClass: 'green',
  },
  WANT_TO_RETURN: {
    name: 'Want to return',
    colorClass: 'orange',
  },
};

export const RefundRequestStatus = {
  PROCESSING: {
    name: 'Processing',
    colorClass: 'gray',
  },
  ACCEPTED: {
    name: 'Accepted',
    colorClass: 'green',
  },
  AUTO_ACCEPTED: {
    name: 'Auto accepted',
    colorClass: 'green',
  },
  REJECTED: {
    name: 'Rejected',
    colorClass: 'red',
  },
  SHIPPING: {
    name: 'Shipping',
    colorClass: 'primary-color',
  },
  RETURNED: {
    name: 'Returned',
    colorClass: 'green',
  },
  REFUNDED: {
    name: 'Returned',
    colorClass: 'cyan',
  },
};

export const REASON_MAP = {
  cb1: 'Wrong product',
  cb2: "I don't want to buy this anymore",
  cb3: 'I make wrong order',
  cb4: 'Other reason',
};