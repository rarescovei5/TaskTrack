import Searchbar from '@/components/ui/Searchbar';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from './context/QueryProvider';

const Header = ({ breadCrumbs }: { breadCrumbs: string[] }) => {
  const navigate = useNavigate();
  const queryCtx = useQuery();

  return (
    <>
      <div className="px-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <ArrowLeft size={16} onClick={() => navigate(-1)} className="cursor-pointer" />
          <div className="flex gap-2 items-center">
            {breadCrumbs.map((name, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={16} className="text-muted" />}
                <p className={idx === breadCrumbs.length - 1 ? '' : 'text-muted'}>
                  {name}
                </p>
              </React.Fragment>
            ))}
          </div>
        </div>
        <Searchbar
          value={queryCtx.query}
          onChange={(e) => queryCtx.setQuery(e.target.value)}
          placeholder="Search for tasks..."
          className="flex-1 max-w-lg"
        ></Searchbar>
      </div>
      <hr className="border border-border" />
    </>
  );
};

export default Header;
