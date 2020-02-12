function setCommentPermissions(userId, posterId, commenterId) {
  console.log('here');
  console.log(userId, posterId, commenterId);
  if (userId === commenterId) {
    console.log('ed');
    return 'ed';
  }

  else if (userId === posterId && userId !== commenterId) {
    console.log('d');
    return 'd';
  }
  else {
    return '';
  }
}

function setPostPermissions(userId, posterId) {
  if (userId === posterId) {
    return 'ed';
  }
  else {
    return '';
  }
}

export { setCommentPermissions, setPostPermissions };