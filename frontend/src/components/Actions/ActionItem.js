import copy from 'clipboard-copy';
import { useEffect, useState } from 'react';

const ActionItem = ({ Icon, linkText, link }) => {
  const [currentUrl, setCurrentUrl] = useState();
  useEffect(() => {
    setCurrentUrl(window.location.href);
  },[])
  const handleCopy = () => {
    const base = currentUrl.split('/');
    base.length = base.length - 1;
    base[base.length] = link;
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