import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import React from 'react';

const Info = ({
  title,
  description,
  SettingsContent,
}: {
  title: string;
  description: string | null;
  SettingsContent: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between px-4 py-3">
      <div className="flex flex-col gap-2">
        <h5>{title}</h5>
        <p className="text-muted">{description || 'No Description'}</p>
      </div>
      <div>
        <Dialog>
          <DialogTrigger className="flex gap-3 px-4 py-3 !left-[unset] items-center border border-border rounded-md cursor-pointer hover:bg-muted/4 active:bg-muted/2">
            <Settings size={16} /> Settings
          </DialogTrigger>
          <DialogContent className="top-4 bottom-4 right-4 translate-y-0 translate-x-0 flex flex-col gap-3 left-[unset]">
            {SettingsContent}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default React.memo(Info);
