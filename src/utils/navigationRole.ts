

export function navigateToRole( user: any, navigate: Function) {
  console.log("Navigating to role:", user);
  
  if (user.role === "ADMIN") {
    navigate("/admin");
    return;
  } else if (user.role === "LECTURER") {
    navigate("/lecturer");
    return;
  } else if (user.role === "ORGANIZATION") {
    navigate("/partner");
    return;
  } else if (user.role === "SCHOOL") {
    navigate("/institution");
    return;
  } else {
    if (user.role === "USER" && user.lecturer !== null) {
      navigate("/pending-lecturer");
      return;
    }
    if (user.role === "USER" && user.educationInstitution !== null) {
      navigate("/pending-institution");
      return;
    }
    if (user.role === "USER" && user.partnerOrganization !== null) {
      navigate("/pending-partner");
      return;
    }
    // navigate("/guest");
    // return;

  }
}
