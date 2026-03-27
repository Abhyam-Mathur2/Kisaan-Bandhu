import { PiggyBank } from "lucide-react";
import { Card } from "../components/Card";
import { FINANCE_SCHEMES } from "../data/financeSchemes";

export function FinancePage() {
  return (
    <div className="space-y-6 pb-10">
      <header>
        <h2 className="text-2xl font-black text-emerald-950">Finance Schemes</h2>
        <p className="text-sm text-emerald-900/70">Static scheme list bundled with app, always available offline.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FINANCE_SCHEMES.map((scheme) => (
          <Card key={scheme.id} className="border border-emerald-100 bg-white p-5" hover={false}>
            <div className="mb-3 flex items-center gap-2 text-emerald-700">
              <div className="rounded-xl bg-emerald-100 p-2">
                <PiggyBank size={16} />
              </div>
              <h3 className="text-lg font-black text-emerald-950">{scheme.name}</h3>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <dt className="min-w-24 font-semibold text-slate-500">Support</dt>
                <dd className="text-slate-700">{scheme.amount}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="min-w-24 font-semibold text-slate-500">Eligibility</dt>
                <dd className="text-slate-700">{scheme.eligibility}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="min-w-24 font-semibold text-slate-500">Window</dt>
                <dd className="text-slate-700">{scheme.window}</dd>
              </div>
            </dl>

            <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900/80">{scheme.note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
