export const Notifications = (props) => {
  const { notifications } = props;

  if(!notifications) return "";

  return (
    <div className="notificationsWrapper">
      {notifications}
    </div>
  );
}
