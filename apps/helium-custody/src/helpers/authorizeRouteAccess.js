const getPermissionTypes = (permissions) => {
  const listOfPermissionTypes = permissions.map((i) => {
    const splitted = i.split("/");

    if (splitted.length === 3) return `${splitted[0]}/${splitted[1]}`;

    return splitted[0];
  });

  return [...new Set(listOfPermissionTypes)];
};

const authorizeRouteAccess = (userPermissions, requiredPermissions) => {
  const listOfRequiredPermissionTypes = getPermissionTypes(requiredPermissions);

  return listOfRequiredPermissionTypes.reduce((acc, permissionType) => {
    const requiredPermissionsOfTheSameType = requiredPermissions.filter((requiredPermission) =>
      requiredPermission.includes(permissionType)
    );

    return (
      acc &&
      userPermissions.some((userPermission) =>
        requiredPermissionsOfTheSameType.includes(userPermission)
      )
    );
  }, true);
};

export default authorizeRouteAccess;
