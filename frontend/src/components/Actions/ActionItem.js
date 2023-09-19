import copy from 'clipboard-copy';
const ActionItem = ({ Icon, linkText, link }) => {
  const currentUrl = window.location.href;
  const base = currentUrl.split('/');
  base.length = base.length - 1;
  base[base.length] = link
  const handleCopy = () => {
    // Copy the content to the clipboard'
   

    copy(base.join('/'))
      .then(() => {
      })
      .catch((error) => {
      });
  };
  return (
    <div
      className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-indigo-800 hover:font-semibold"
      onClick={handleCopy}
    >
      <Icon />
      <h2>
        {
          linkText
        }
      </h2>
    </div>
  )
}

export default ActionItem