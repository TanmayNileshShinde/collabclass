import { Link } from 'react-router-dom';

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PermissionCardProps {
  title: string;
  iconUrl?: string;
}

const Alert = ({ title, iconUrl }: PermissionCardProps) => {
  return (
    <section className="flex-center h-screen w-full">
      <Card className="w-full max-w-[520px] border border-light-4 dark:border-dark-4 bg-light-1 dark:bg-dark-1 p-6 py-9 text-dark-2 dark:text-white transition-colors">
        <CardContent>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-3.5">
              {iconUrl && (
                <div className="flex-center"> 
                  <img src={iconUrl} width={72} height={72} alt="icon" />
                </div>
              )}
              <p className="text-center text-xl font-semibold">{title}</p>
            </div>

            <Button asChild className="bg-royal-1 hover:bg-royal-2 text-white">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Alert;

