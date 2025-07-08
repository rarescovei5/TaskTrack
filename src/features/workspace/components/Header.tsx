import Searchbar from '@/components/ui/Searchbar';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryCtx } from './context/QueryProvider';

const Header = ({ breadCrumbs }: { breadCrumbs: string[] }) => {
  const navigate = useNavigate();
  const queryCtx = useQueryCtx();

  return (
    <>
      <div className="px-4 flex justify-between items-center gap-4">
        <div className="flex gap-4 items-center flex-1">
          <ArrowLeft size={16} onClick={() => navigate(-1)} className="cursor-pointer" />
          <div className="flex gap-2 items-center flex-1">
            {breadCrumbs.map((name, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={16} className="text-muted" />}
                <p
                  className={
                    idx === breadCrumbs.length - 1 ? '' : 'text-muted truncate max-w-1/2'
                  }
                >
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
