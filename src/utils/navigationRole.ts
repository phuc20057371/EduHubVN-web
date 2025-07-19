

export function navigateToRole( user: any, navigate: Function) {
  if (user.role === "ADMIN") {
    navigate("/admin");
    return;
  } else if (user.role === "LECTURER") {
    navigate("/lecturer");
    return;
  } else if (user.role === "PARTNER") {
    navigate("/partner");
    return;
  } else if (user.role === "INSTITUTION") {
    navigate("/institution");
    return;
  } else {
    if (user.role === "USER" && user.lecturer !== null) {
      navigate("/pending-lecturer");
      return;
    }
    if (user.role === "USER" && user.institution !== null) {
      navigate("/pending-institution");
      return;
    }
    if (user.role === "USER" && user.partner !== null) {
      navigate("/pending-partner");
      return;
    }
    navigate("/guest");
    return;

  }
}
