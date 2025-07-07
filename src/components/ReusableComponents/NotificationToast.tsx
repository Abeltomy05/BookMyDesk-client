type Props = { title: string; body: string };

export const NotificationToast = ({ title, body }: Props) => {
   return(
    <div className="bg-white px-4 py-2 rounded shadow-md border border-gray-200 max-w-xs">
      <p className="font-semibold text-black">{title}</p>
      <p className="text-sm text-gray-700">{body}</p>
    </div>
   )
}

