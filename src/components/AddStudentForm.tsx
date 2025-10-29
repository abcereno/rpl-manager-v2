// src/components/AddStudentForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

// ---- Types that mirror your schema ----
interface Rto {
  id: string;
  rto_code: string | null;
  trading_name: string | null;
}

interface OfferRow {
  id: string; // offers.id
  qualification: {
    id: string;
    name: string | null;
    code: string | null;
  } | null;
  rto: {
    id: string;
    trading_name: string | null;
  } | null;
}

interface OfferStream {
  id: string;
  name: string;
  offer_id: string;
}

interface OfferUnitRow {
  id: string;
  unit_type: 'core' | 'elective' | string | null;
  group_code: string | null;
  application_details: string | null;
  unit: {
    id: string;
    code: string;
    name: string | null;
  } | null;
}

interface AddStudentFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSuccess, onCancel }) => {
  const { profile } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const [selectedRtoId, setSelectedRtoId] = useState<string>('');
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [selectedStreamId, setSelectedStreamId] = useState<string>('');

  // Data state
  const [rtos, setRtos] = useState<Rto[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [streams, setStreams] = useState<OfferStream[]>([]);
  const [offerUnits, setOfferUnits] = useState<OfferUnitRow[]>([]); // for preview

  // UX/loading/error
  const [loadingRtos, setLoadingRtos] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feature-detect whether students.stream_id exists (so we can save it)
  const [studentsHasStreamId, setStudentsHasStreamId] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        // If column doesn't exist, PostgREST returns an error; treat that as "false"
        const { error } = await supabase.from('students').select('stream_id').limit(1);
        setStudentsHasStreamId(!error);
      } catch {
        setStudentsHasStreamId(false);
      }
    })();
  }, []);

  // Load RTOs once
  useEffect(() => {
    (async () => {
      setLoadingRtos(true);
      setError(null);

      const { data, error: rtoErr } = await supabase
        .from('rtos')
        .select('id, rto_code, trading_name')
        .order('trading_name', { ascending: true });

      if (rtoErr) {
        console.error('Error fetching RTOs:', rtoErr);
        setError('Could not load RTOs.');
        setRtos([]);
      } else {
        setRtos((data as Rto[]) || []);
      }
      setLoadingRtos(false);
    })();
  }, []);

  // Load OFFERS for selected RTO (joined to qualifications)
  useEffect(() => {
    (async () => {
      setOffers([]);
      setSelectedOfferId('');
      setStreams([]);
      setSelectedStreamId('');
      setOfferUnits([]);

      if (!selectedRtoId) return;

      setLoadingOffers(true);
      setError(null);

      const { data, error: offersErr } = await supabase
        .from('offers')
        .select(`
          id,
          qualification:qualifications!offers_qualification_id_fkey ( id, name, code ),
          rto:rtos!offers_rto_id_fkey ( id, trading_name )
        `)
        .eq('rto_id', selectedRtoId)
        .eq('status', 'active')
        .order('id', { ascending: true });

      if (offersErr) {
        console.error('Error fetching offers:', offersErr);
        setError('Could not load qualifications for the selected RTO.');
        setOffers([]);
      } else {
        const rows = (data as unknown as OfferRow[]) || [];
        setOffers(rows);
        if (rows.length === 1) setSelectedOfferId(rows[0].id);
      }

      setLoadingOffers(false);
    })();
  }, [selectedRtoId]);

  // Load STREAMS + OFFER UNITS for selected offer
  useEffect(() => {
    (async () => {
      setStreams([]);
      setSelectedStreamId('');
      setOfferUnits([]);

      if (!selectedOfferId) return;

      // Streams
      setLoadingStreams(true);
      const { data: sdata, error: streamErr } = await supabase
        .from('offer_streams')
        .select('id, name, offer_id')
        .eq('offer_id', selectedOfferId)
        .order('name', { ascending: true });

      if (streamErr) {
        console.warn('Error fetching streams (non-fatal):', streamErr);
      } else {
        setStreams((sdata as OfferStream[]) || []);
        if ((sdata?.length || 0) === 1) setSelectedStreamId((sdata as OfferStream[])[0].id);
      }
      setLoadingStreams(false);

      // Offer Units preview (join to units)
      setLoadingUnits(true);
      const { data: udata, error: unitsErr } = await supabase
        .from('offer_units')
        .select(`
          id,
          unit_type,
          group_code,
          application_details,
          unit:units!offer_units_unit_id_fkey ( id, code, name )
        `)
        .eq('offer_id', selectedOfferId)
        .order('unit_type', { ascending: true });

      if (unitsErr) {
        console.warn('Error fetching offer units (preview):', unitsErr);
        setOfferUnits([]);
      } else {
        setOfferUnits((udata as unknown as OfferUnitRow[]) || []);
      }
      setLoadingUnits(false);
    })();
  }, [selectedOfferId]);

  // Reusable: find or create profile
  const getOrCreateProfileId = async (
    emailAddr: string,
    fullNameVal: string,
    companyId?: string | null,
    rtoId?: string
  ) => {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', emailAddr)
      .maybeSingle();

    if (existingProfile?.id) return existingProfile.id as string;

    const metadata: Record<string, any> = {
      full_name: fullNameVal,
      role: 'student',
      ...(companyId ? { company_id: companyId } : {}),
      ...(rtoId ? { rto_id: rtoId } : {}),
    };

    const { data: inviteData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(emailAddr, { data: metadata });

    if (inviteError) {
      if (inviteError.message?.toLowerCase().includes('registered')) {
        const { data: p2, error: p2Err } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', emailAddr)
          .maybeSingle();

        if (p2Err || !p2?.id) {
          throw new Error(`User exists but profile not found. Ask them to log in once or create profile manually.`);
        }
        return p2.id as string;
      }
      throw new Error(`Invite error: ${inviteError.message}`);
    }

    if (!inviteData?.user?.id) throw new Error('Invitation sent, but user id missing.');

    const newUserId = inviteData.user.id as string;

    // Ensure profiles row (best-effort)
    const upsertPayload: any = {
      id: newUserId,
      email: emailAddr,
      full_name: fullNameVal,
      role: 'student',
    };
    if (companyId) upsertPayload.company_id = companyId;
    if (rtoId) upsertPayload.rto_id = rtoId;

    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert(upsertPayload, { onConflict: 'id' });

    if (upsertErr) {
      console.warn('profiles upsert warning:', upsertErr.message);
    }
    return newUserId;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !fullName || !selectedRtoId || !selectedOfferId) {
      setError('Please fill in all required fields.');
      return;
    }
    if (studentsHasStreamId && streams.length > 0 && !selectedStreamId) {
      setError('Please choose a stream for this offer.');
      return;
    }

    setLoadingInvite(true);
    try {
      const offerRow = offers.find(o => o.id === selectedOfferId);
      if (!offerRow || !offerRow.qualification || !offerRow.rto) {
        throw new Error('Selected offer details are incomplete. Please re-select.');
      }

      const companyId = profile?.company_id ?? null;
      const rtoId = offerRow.rto.id;
      const qualificationId = offerRow.qualification.id;

      const profileId = await getOrCreateProfileId(email.trim(), fullName.trim(), companyId, rtoId);

      // Insert student enrollment (with optional stream)
      const insertPayload: Record<string, any> = {
        profile_id: profileId,
        offer_id: selectedOfferId,
        qualification_id: qualificationId,
        rto_id: rtoId,
        company_id: companyId,
        status: 'pending',
        progress: 0,
        evidence_count: 0,
        enrolled_date: new Date().toISOString(),
      };
      if (studentsHasStreamId && selectedStreamId) {
        insertPayload.stream_id = selectedStreamId;
      }

      const { error: studentErr } = await supabase
        .from('students')
        .insert(insertPayload);

      if (studentErr) {
        console.error('Error creating student record:', studentErr);
        throw new Error(`User invited/linked, but failed to create enrollment: ${studentErr.message}`);
      }

      toast({
        title: 'Success',
        description: `Student invited/enrolled for ${offerRow.qualification.name || offerRow.qualification.code}.`
      });

      // reset
      setEmail('');
      setFullName('');
      setSelectedRtoId('');
      setSelectedOfferId('');
      setSelectedStreamId('');
      setOffers([]);
      setStreams([]);
      setOfferUnits([]);
      onSuccess?.();
    } catch (err: any) {
      console.error('Add student error:', err);
      setError(err.message || 'Failed to add student.');
      toast({ variant: 'destructive', title: 'Invite/Enroll Failed', description: err.message });
    } finally {
      setLoadingInvite(false);
    }
  };

  // ---- Helpers for preview grouping ----
  const groupedByGroupCode: Record<string, OfferUnitRow[]> = React.useMemo(() => {
    const map: Record<string, OfferUnitRow[]> = {};
    for (const row of offerUnits) {
      const key = row.group_code || '—';
      if (!map[key]) map[key] = [];
      map[key].push(row);
    }
    // Sort each group by unit_type then unit.code
    Object.values(map).forEach(arr =>
      arr.sort((a, b) => {
        const tA = (a.unit_type || '').localeCompare(b.unit_type || '');
        if (tA !== 0) return tA;
        return (a.unit?.code || '').localeCompare(b.unit?.code || '');
      })
    );
    return map;
  }, [offerUnits]);

  const coreCount = offerUnits.filter(u => (u.unit_type || '').toLowerCase() === 'core').length;
  const elecCount = offerUnits.filter(u => (u.unit_type || '').toLowerCase() === 'elective').length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-1 py-2">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Invite New Student</h3>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Full name */}
      <div className="space-y-1">
        <Label htmlFor="invite-name">Full Name</Label>
        <Input
          id="invite-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Student's Full Name"
          disabled={loadingInvite}
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="invite-email">Email Address</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="student@example.com"
          disabled={loadingInvite}
        />
      </div>

      {/* RTO */}
      <div className="space-y-1">
        <Label htmlFor="invite-rto">RTO</Label>
        <Select
          value={selectedRtoId}
          onValueChange={(val) => setSelectedRtoId(val)}
          disabled={loadingRtos || loadingInvite}
          required
        >
          <SelectTrigger id="invite-rto">
            <SelectValue placeholder={loadingRtos ? 'Loading RTOs...' : 'Select RTO...'} />
          </SelectTrigger>
          <SelectContent>
            {!loadingRtos && rtos.length === 0 && (
              <SelectItem value="no-rtos" disabled>No RTOs found</SelectItem>
            )}
            {rtos.map((rto) => (
              <SelectItem key={rto.id} value={rto.id}>
                {rto.trading_name || rto.rto_code || rto.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Qualification (from offers) filtered by RTO */}
      <div className="space-y-1">
        <Label htmlFor="invite-offer">Qualification (from this RTO’s offers)</Label>
        <Select
          value={selectedOfferId}
          onValueChange={setSelectedOfferId}
          disabled={loadingOffers || loadingInvite || !selectedRtoId}
          required
        >
          <SelectTrigger id="invite-offer">
            <SelectValue
              placeholder={!selectedRtoId
                ? 'Select an RTO first...'
                : (loadingOffers ? 'Loading qualifications...' : 'Select qualification...')}
            />
          </SelectTrigger>
          <SelectContent>
            {!loadingOffers && selectedRtoId && offers.length === 0 && (
              <SelectItem value="no-offers" disabled>No active qualifications for this RTO</SelectItem>
            )}
            {offers.map((offer) => (
              <SelectItem key={offer.id} value={offer.id}>
                {(offer.qualification?.name || offer.qualification?.code || 'Unnamed Qualification')}
                {offer.rto?.trading_name ? ` — ${offer.rto.trading_name}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!loadingOffers && selectedRtoId && offers.length === 0 && (
          <p className="text-xs text-red-500 mt-1">No active qualifications found for this RTO.</p>
        )}
      </div>

      {/* Stream (variation) within the selected offer */}
      {studentsHasStreamId && (
        <div className="space-y-1">
          <Label htmlFor="invite-stream">Stream / Group (optional)</Label>
          <Select
            value={selectedStreamId}
            onValueChange={setSelectedStreamId}
            disabled={loadingStreams || loadingInvite || !selectedOfferId || streams.length === 0}
          >
            <SelectTrigger id="invite-stream">
              <SelectValue
                placeholder={
                  !selectedOfferId
                    ? 'Select a qualification first...'
                    : (loadingStreams
                        ? 'Loading streams...'
                        : (streams.length ? 'Select stream...' : 'No streams for this offer'))
                }
              />
            </SelectTrigger>
            <SelectContent>
              {streams.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!selectedOfferId && !loadingStreams && streams.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">This offer has no separate streams; all units come from the offer.</p>
          )}
        </div>
      )}

      {/* Offer Structure Preview */}
      {!!selectedOfferId && (
        <div className="mt-4 border rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-[#373b40]">Offer Structure</h4>
            {loadingUnits ? (
              <span className="text-xs text-gray-500">Loading units…</span>
            ) : (
              <span className="text-xs text-gray-600">
                Core: <strong>{coreCount}</strong> • Electives: <strong>{elecCount}</strong> • Total: <strong>{offerUnits.length}</strong>
              </span>
            )}
          </div>

          {!loadingUnits && offerUnits.length === 0 && (
            <p className="text-sm text-gray-500">No units found for this offer.</p>
          )}

          {!loadingUnits && offerUnits.length > 0 && (
            <div className="space-y-3">
              {Object.entries(groupedByGroupCode).map(([group, rows]) => (
                <div key={group} className="border rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">
                    Group: <span className="inline-block rounded bg-gray-100 px-2 py-0.5">{group}</span>
                  </div>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {rows.map((r) => (
                      <li key={r.id}>
                        <span className="uppercase tracking-wide">{r.unit_type || '—'}</span>{' • '}
                        <strong>{r.unit?.code}</strong>{' — '}{r.unit?.name || 'Unnamed'}
                        {r.application_details ? (
                          <span className="text-xs text-gray-500"> — {r.application_details}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loadingInvite}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            loadingInvite ||
            !selectedRtoId ||
            !selectedOfferId ||
            rtos.length === 0
          }
        >
          {loadingInvite ? 'Sending Invite...' : 'Send Invitation'}
        </Button>
      </div>
    </form>
  );
};
