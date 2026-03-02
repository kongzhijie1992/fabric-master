import {companyFacts} from '@/content/site';

export function LicenseInfoCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <h3 className="text-xl font-semibold text-slate-900">Business License Information</h3>
      <dl className="mt-4 space-y-3 text-sm text-slate-700">
        <div>
          <dt className="font-semibold text-slate-900">Company Name (CN)</dt>
          <dd>{companyFacts.nameCn}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Unified Social Credit Code</dt>
          <dd>{companyFacts.unifiedSocialCreditCode}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Legal Representative / Responsible Person</dt>
          <dd>{companyFacts.legalRepresentative}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Established Date</dt>
          <dd>{companyFacts.establishedDate}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Business Type</dt>
          <dd>{companyFacts.businessType}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Address (CN)</dt>
          <dd>{companyFacts.addressCn}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Business Scope Summary</dt>
          <dd>
            {companyFacts.businessScopeSummaryCn} / {companyFacts.businessScopeSummaryEn}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-slate-500">Scope is subject to official business license registration.</p>
    </section>
  );
}
