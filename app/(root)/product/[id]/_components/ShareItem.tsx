const ShareItem = ({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className="flex items-center gap-3 border rounded-md px-3 py-2
      text-sm hover:bg-gray-50 cursor-pointer"
    >
      {icon ?? <div className="w-4 h-4 bg-gray-400 rounded-full" />}
      <span>{label}</span>
    </div>
  );
};

export default ShareItem;
