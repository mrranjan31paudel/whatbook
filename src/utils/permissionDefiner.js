function setCommentPermissions(userId, posterId, commenterId) {
  if (userId === commenterId) {
    return 'ed';
  }

  else if (userId === posterId && userId !== commenterId) {
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