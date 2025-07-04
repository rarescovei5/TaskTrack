import Searchbar from '@/components/ui/Searchbar';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  breadCrumbs: string[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}
const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="px-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <ArrowLeft size={16} onClick={() => navigate(-1)} className="cursor-pointer" />
          <div className="flex gap-2 items-center">
            {props.breadCrumbs.map((name, idx) => (
              <React.Fragment key={idx}>
                <span
                  className={idx === props.breadCrumbs.length - 1 ? '' : 'text-muted'}
                >
                  {name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <Searchbar
          value={props.query}
          onChange={(e) => props.setQuery(e.target.value)}
        ></Searchbar>
      </div>
      <hr className="border border-border" />
    </>
  );
};

export default Header;
