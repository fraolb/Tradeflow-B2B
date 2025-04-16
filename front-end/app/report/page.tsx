import { Card } from "@/components/ui/card";
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

const page = () => {
  return (
    <div>
      <div className="w-full">
        <div className="flex justify-between px-2 mb-2">
          <h3 className="font-bold font-mono">Latest Transactions</h3>
          <div className="font-light">See all</div>
        </div>
        <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2">
          <div className="text-red-700 pt-1">
            <ArrowUpCircleIcon className="w-10 h-10" />
          </div>

          <div className="block w-3/5">
            <div>To 10 blocks of Ice</div>
            <div className="text-sm">0xabcd32r342...</div>
          </div>
          <span className="w-1/5 text-red-700 pt-2 text-center">- 250 $</span>
        </Card>
        <Card className="w-full bg-gray-50 flex flex-row justify-beteween px-2 py-2 mb-2">
          <div className="text-green-700 pt-1">
            <ArrowDownCircleIcon className="w-10 h-10" />
          </div>

          <div className="block w-3/5">
            <div>Buy Macbook Pc</div>
            <div className="text-sm">0xabcd32r342...</div>
          </div>
          <span className="w-1/5 text-green-700 pt-2 text-center">+ 750 $</span>
        </Card>
      </div>
    </div>
  );
};

export default page;
