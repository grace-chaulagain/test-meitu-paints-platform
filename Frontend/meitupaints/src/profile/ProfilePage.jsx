import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../auth/AuthProvider.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import NavBar from "../components/NavBar.jsx";

import {
  GlassCard,
  HeroShell,
  SectionTitle,
} from "./components/ProfileShell.jsx";

import ProfileIdentityCard from "./components/ProfileIdentityCard.jsx";

import DealerProfileSection from "./sections/DealerProfileSection.jsx";
import AdminProfileSection from "./sections/AdminProfileSection.jsx";

export default function ProfilePage() {
  const { user: authUser, booting } = useAuth();
  const reduxUser = useSelector((state) => state?.user?.user || null);
  const reduxRole = useSelector((state) => state?.user?.role || null);
  const reduxDealerProfile = useSelector(
    (state) => state?.user?.dealerProfile || null,
  );

  const sourceUser = reduxUser || authUser || null;

  const profile = useMemo(() => {
    if (!sourceUser) return null;

    const username =
      sourceUser?.username ||
      sourceUser?.name ||
      sourceUser?.fullName ||
      sourceUser?.contactName ||
      reduxDealerProfile?.contactName ||
      (sourceUser?.email
        ? String(sourceUser.email).split("@")[0]
        : "Meitu User");

    const role = String(reduxRole || sourceUser?.role || "USER").toUpperCase();
    const dealer = role === "DEALER" ? reduxDealerProfile || null : null;

    return {
      username,
      initial: String(username || "U")
        .trim()
        .charAt(0)
        .toUpperCase(),
      email: sourceUser?.email || dealer?.email || "—",
      role,
      status: String(
        dealer?.status || sourceUser?.status || "ACTIVE",
      ).toUpperCase(),

      companyName: dealer?.companyName || "—",
      contactName: dealer?.contactName || username,
      phone: dealer?.phone || sourceUser?.phone || "—",
      address: dealer?.address || sourceUser?.address || "—",
      panVat: dealer?.panVat || "—",

      dispatcherName:
        dealer?.dispatcherName || dealer?.dispatcherId || "Not assigned",
      creditLimit:
        dealer?.creditLimit != null
          ? `NPR ${Number(dealer.creditLimit).toLocaleString()}`
          : "—",
      availableCredit:
        dealer?.availableCredit != null
          ? `NPR ${Number(dealer.availableCredit).toLocaleString()}`
          : "—",
    };
  }, [reduxDealerProfile, reduxRole, sourceUser]);

  if (booting) return null;
  if (!profile) return <NotFoundPage />;

  return (
    <>
      <NavBar />
      <div
        className="profile-page-shell"
        style={{
          minHeight: "100vh",
          paddingTop: 92,
          paddingBottom: 56,
          background:
            "radial-gradient(900px 520px at 12% 0%, rgba(255,230,160,.46), transparent 52%), radial-gradient(900px 520px at 88% 10%, rgba(255,120,80,.18), transparent 45%), linear-gradient(180deg, #f5f6f8 0%, #edf1f5 100%)",
        }}
      >
        <div className="container profile-page-container" style={{ maxWidth: 1460 }}>
          <HeroShell>
            <SectionTitle
              eyebrow="Profile"
              title="Your Workspace Identity"
              desc="A premium overview of your Meitu account, operational context, and business identity — now driven directly from authenticated Redux state."
              right={
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,.74)",
                    border: "1px solid rgba(0,0,0,.05)",
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,.56)",
                  }}
                >
                  {profile.role} Workspace
                </div>
              }
            />
          </HeroShell>

          <div
            className="profile-page-layout"
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "380px minmax(0, 1fr)",
              gap: 22,
              alignItems: "start",
            }}
          >
            <div className="profile-identity-column" style={{ position: "sticky", top: 92 }}>
              <ProfileIdentityCard profile={profile} />
            </div>

            <div>
              {profile.role === "DEALER" ? (
                <DealerProfileSection profile={profile} />
              ) : (
                <AdminProfileSection profile={profile} />
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .profile-page-shell,
        .profile-page-shell *{
          box-sizing:border-box;
        }
        .profile-page-container{
          width:min(100% - 28px, 1460px);
        }
        .profile-page-layout{
          min-width:0;
        }
        .profile-identity-column{
          min-width:0;
        }
        .profile-section-title{
          min-width:0;
        }
        .profile-section-heading{
          overflow-wrap:anywhere;
        }
        @media (max-width:1180px){
          .profile-page-layout{
            grid-template-columns:320px minmax(0,1fr) !important;
            gap:18px !important;
          }
        }
        @media (max-width:980px){
          .profile-page-shell{
            padding-top:82px !important;
            padding-bottom:36px !important;
          }
          .profile-page-layout{
            grid-template-columns:1fr !important;
          }
          .profile-identity-column{
            position:static !important;
          }
        }
        @media (max-width:640px){
          .profile-page-container{
            width:min(100% - 20px, 1460px);
          }
          .profile-page-shell{
            padding-top:76px !important;
          }
          .profile-page-layout{
            margin-top:14px !important;
            gap:14px !important;
          }
          .profile-section-title{
            display:grid !important;
            gap:14px !important;
            align-items:start !important;
          }
          .profile-section-heading{
            font-size:clamp(30px, 10vw, 38px) !important;
            letter-spacing:-.04em !important;
          }
          .profile-section-desc{
            font-size:14px !important;
            line-height:1.55 !important;
          }
        }
      `}</style>
    </>
  );
}
