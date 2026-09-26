import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [hasEnteredWarzone, setHasEnteredWarzone] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [timer, setTimer] = useState(5);
  const [isDetonated, setIsDetonated] = useState(false);
  const [blastKey, setBlastKey] = useState(0);
  const [recallProgress, setRecallProgress] = useState(0);
  const [isRecalling, setIsRecalling] = useState(false);
  const [draculaRevived, setDraculaRevived] = useState(false);
  const [grenadeAirborne, setGrenadeAirborne] = useState(false);
  const [grenadeBurst, setGrenadeBurst] = useState(false);
  const [bulletWave, setBulletWave] = useState(0);

  const bgAudioRef = useRef(null);
  const bdayAudioRef = useRef(null);
  const hasExploded = useRef(false);

  const publicPrefix =
    typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL.replace(/\/$/, '')
      : '';

  const audioTracks = {
    bg: `${publicPrefix}/images/bg.mp3`,
    bday: `${publicPrefix}/images/bday.mp3`,
  };

  const squadPoster = {
    primary: `${publicPrefix}/images/we.png`,
    fallback: 'images/we.png',
  };

  const gallery = [
    { src: `${publicPrefix}/images/n1.png`, fallback: 'images/n1.png', title: 'MISSION ARCHIVE 01 // FRONT RECON' },
    { src: `${publicPrefix}/images/n2.png`, fallback: 'images/n2.png', title: 'MISSION ARCHIVE 02 // COMBAT SURGEON' },
    { src: `${publicPrefix}/images/n3.png`, fallback: 'images/n3.png', title: 'MISSION ARCHIVE 03 // CLUTCH EXTRACTION' },
    { src: `${publicPrefix}/images/n4.png`, fallback: 'images/n4.png', title: 'MISSION ARCHIVE 04 // RED ZONE ANCHOR' },
    { src: `${publicPrefix}/images/n5.png`, fallback: 'images/n5.png', title: 'MISSION ARCHIVE 05 // QUEEN OF MIDSTEIN' },
  ];

  // Try immediate autoplay on page load/refresh
  useEffect(() => {
    const bgAudio = bgAudioRef.current;
    if (!bgAudio) return;

    bgAudio.volume = 1.0;
    const initialPromise = bgAudio.play();
    if (initialPromise !== undefined) {
      initialPromise
        .then(() => {
          // Autoplay permitted by browser policy
          setHasEnteredWarzone(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy; wait for entry click
        });
    }
  }, []);

  // Deploy Operative Handler: Engages Audio
  const handleDeployToBattle = () => {
    setHasEnteredWarzone(true);
    if (bgAudioRef.current) {
      bgAudioRef.current.currentTime = 0;
      bgAudioRef.current.volume = 1.0;
      bgAudioRef.current.muted = false;
      bgAudioRef.current.play().catch(() => {});
    }
  };

  // Periodic bullet streaks
  useEffect(() => {
    if (!hasEnteredWarzone) return;
    const bulletInterval = setInterval(() => {
      setBulletWave((prev) => prev + 1);
    }, 2900);
    return () => clearInterval(bulletInterval);
  }, [hasEnteredWarzone]);

  // 5-second countdown timer
  useEffect(() => {
    if (!hasEnteredWarzone) return;
    const cd = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(cd);
          if (!hasExploded.current) {
            hasExploded.current = true;
            setIsDetonated(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cd);
  }, [hasEnteredWarzone]);

  // Modal slideshow rotation
  useEffect(() => {
    if (!isGiftModalOpen) return;
    const interval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % gallery.length);
      setBlastKey((k) => k + 1);
    }, 3200);
    return () => clearInterval(interval);
  }, [isGiftModalOpen, gallery.length]);

  // AIRDROP TRIGGER: Cut bg.mp3 -> Play bday.mp3
  const handleOpenAirdrop = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current.currentTime = 0;
    }
    if (bdayAudioRef.current) {
      bdayAudioRef.current.currentTime = 0;
      bdayAudioRef.current.volume = 1.0;
      bdayAudioRef.current.muted = false;
      bdayAudioRef.current.play().catch(() => {});
    }
    setIsGiftModalOpen(true);
    setBlastKey((k) => k + 1);
  };

  // CLOSE MODAL: Cut bday.mp3 -> Resume bg.mp3
  const handleCloseModal = () => {
    if (bdayAudioRef.current) {
      bdayAudioRef.current.pause();
      bdayAudioRef.current.currentTime = 0;
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.currentTime = 0;
      bgAudioRef.current.volume = 1.0;
      bgAudioRef.current.muted = false;
      bgAudioRef.current.play().catch(() => {});
    }
    setIsGiftModalOpen(false);
  };

  const handleThrowGrenade = () => {
    if (grenadeAirborne) return;
    setGrenadeAirborne(true);
    setGrenadeBurst(false);

    setTimeout(() => {
      setGrenadeAirborne(false);
      setGrenadeBurst(true);
      setTimeout(() => setGrenadeBurst(false), 2600);
    }, 850);
  };

  const triggerRecall = () => {
    if (isRecalling || draculaRevived) return;
    setIsRecalling(true);
    let p = 0;
    const inv = setInterval(() => {
      p += 10;
      setRecallProgress(p);
      if (p >= 100) {
        clearInterval(inv);
        setIsRecalling(false);
        setDraculaRevived(true);
      }
    }, 250);
  };

  return (
    <div style={css.page}>
      {/* Audio Engine */}
      <audio
        ref={bgAudioRef}
        src={audioTracks.bg}
        preload="auto"
        loop
        playsInline
      />
      <audio
        ref={bdayAudioRef}
        src={audioTracks.bday}
        preload="auto"
        loop
        playsInline
      />

      <style>{`
        @keyframes sniperTracer {
          0% { transform: translateX(-30vw) scaleY(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(130vw) scaleY(1.4); opacity: 0; }
        }

        @keyframes dynamicWarplaneRoute {
          0% { transform: translate(-15vw, 6vh) rotate(8deg) scale(0.9); }
          25% { transform: translate(35vw, 36vh) rotate(-7deg) scale(1.08); }
          50% { transform: translate(68vw, 12vh) rotate(10deg) scale(0.92); }
          75% { transform: translate(88vw, 46vh) rotate(-8deg) scale(1.1); }
          100% { transform: translate(118vw, 8vh) rotate(6deg) scale(0.9); }
        }

        @keyframes pulseBloodRed {
          0%, 100% {
            border-color: rgba(220, 38, 38, 0.45);
            box-shadow: 0 0 25px rgba(185, 28, 28, 0.45), inset 0 0 20px rgba(127, 29, 29, 0.2);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.95);
            box-shadow: 0 0 55px rgba(220, 38, 38, 0.85), inset 0 0 35px rgba(220, 38, 38, 0.35);
          }
        }

        @keyframes bounceAirdropCrate {
          0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 22px rgba(239, 68, 68, 0.8)); }
          50% { transform: translateY(-18px) scale(1.06); filter: drop-shadow(0 0 50px rgba(245, 158, 11, 0.95)); }
        }

        @keyframes popModalIn {
          0% { transform: scale(0.72); opacity: 0; }
          60% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes lobGrenadeArc {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.8); opacity: 1; }
          45% { transform: translate(45vw, -36vh) rotate(420deg) scale(1.35); opacity: 1; }
          100% { transform: translate(50vw, 4vh) rotate(840deg) scale(1); opacity: 1; }
        }

        @keyframes shockwaveRing {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; border-width: 8px; }
          100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; border-width: 1px; }
        }

        @keyframes petalBloomScatter {
          0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 1; }
          50% { transform: translate(var(--fx), var(--fy)) scale(1.5) rotate(180deg); opacity: 1; }
          100% { transform: translate(var(--fx), calc(var(--fy) + 70px)) scale(0.9) rotate(360deg); opacity: 0; }
        }

        @keyframes photoFragranceBloom {
          0% { filter: brightness(1.25) contrast(1.1); transform: scale(1.02); }
          100% { filter: brightness(1) contrast(1); transform: scale(1); }
        }

        @keyframes blastParticleBurst {
          0% { transform: translate(0, 0) scale(1.2); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.1); opacity: 0; }
        }

        @keyframes gateGlowPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px #ef4444); }
          50% { transform: scale(1.04); filter: drop-shadow(0 0 45px #f59e0b); }
        }

        @keyframes radarLineScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }

        .anim-plane-fly { animation: dynamicWarplaneRoute 16s ease-in-out infinite alternate; }
        .anim-blood-pulse { animation: pulseBloodRed 2.4s ease-in-out infinite; }
        .anim-airdrop-bounce { animation: bounceAirdropCrate 1.5s ease-in-out infinite; cursor: pointer; }
        .anim-modal-in { animation: popModalIn 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
        .anim-grenade-fly { animation: lobGrenadeArc 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .anim-fragrant-photo { animation: photoFragranceBloom 0.6s ease-out forwards; }
        .anim-gate-glow { animation: gateGlowPulse 2.2s infinite ease-in-out; }

        .tactical-bullet {
          position: fixed;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #fbbf24 35%, #ef4444 80%, #ffffff 100%);
          box-shadow: 0 0 16px #f59e0b, 0 0 8px #ef4444;
          pointer-events: none;
          z-index: 45;
          animation: sniperTracer 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @media (max-width: 768px) {
          .hud-header-bar {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 10px 12px !important;
            gap: 8px !important;
          }
          .hud-header-badge-full {
            width: 100% !important;
            text-align: center !important;
            box-sizing: border-box !important;
            padding: 10px 8px !important;
            font-size: 11px !important;
            justify-content: center !important;
          }
          .hud-header-btn-full {
            width: 100% !important;
            padding: 12px 10px !important;
            font-size: 12px !important;
            text-align: center !important;
            display: block !important;
            box-sizing: border-box !important;
          }
          .hero-split-layout {
            flex-direction: column !important;
          }
          .hero-poster-column {
            max-width: 100% !important;
            width: 100% !important;
            padding: 8px !important;
          }
          .tactical-modal-frame {
            padding: 16px 12px !important;
            max-height: 94vh !important;
          }
          .tactical-photo-display {
            height: 290px !important;
          }
          .lobby-gate-card {
            padding: 24px 18px !important;
            margin: 16px !important;
          }
        }
      `}</style>

      {/* TACTICAL BGMI WARFARE ENTRY GATE */}
      {!hasEnteredWarzone && (
        <div style={css.lobbyGateOverlay}>
          <div style={css.lobbyGateCard} className="lobby-gate-card anim-blood-pulse">
            <div style={css.gateScopeFrame}>
              <div style={css.gateCrossH} />
              <div style={css.gateCrossV} />
              <div className="anim-gate-glow" style={{ fontSize: '4.8rem', zIndex: 3 }}>
                🪖
              </div>
            </div>

            <div style={css.gateLogoTag}>BATTLEGROUNDS LIVIK PROTOCOL</div>
            <h1 style={css.gateTitle}>OPERATION NATASHA 2026</h1>
            <p style={css.gateSubtitle}>
              VIP MEDIC PROTOCOL INITIALIZED // SQUAD 4-RECON STANDBY
            </p>

            <div style={css.gateRosterPreview}>
              <span>#1 SULTHAN</span>
              <span>●</span>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>#2 NATASHAAA</span>
              <span>●</span>
              <span>#3 DRACULA</span>
              <span>●</span>
              <span>#4 ACE SICARIO</span>
            </div>

            <button
              onClick={handleDeployToBattle}
              style={css.deployActionBtn}
              className="anim-airdrop-bounce"
            >
              <span style={{ fontSize: '1.2rem' }}>⚔️</span> ENTER THE BATTLEFIELD // DEPLOY SQUAD
            </button>
            <div style={css.gateAudioHint}>
              [ LIVIK AMBIENT WARFARE & bg.mp3 WILL ENGAGE AT 100% COMBAT VOLUME ]
            </div>
          </div>
        </div>
      )}

      {/* Floating Tactical Bullet Tracers Across All Zones */}
      {hasEnteredWarzone && (
        <>
          <div
            key={`bullet-1-${bulletWave}`}
            className="tactical-bullet"
            style={{ top: '18%', width: '260px', left: 0 }}
          />
          {bulletWave % 2 === 0 && (
            <div
              key={`bullet-2-${bulletWave}`}
              className="tactical-bullet"
              style={{ top: '55%', width: '220px', left: 0, animationDelay: '0.12s' }}
            />
          )}
          {bulletWave % 3 === 0 && (
            <div
              key={`bullet-3-${bulletWave}`}
              className="tactical-bullet"
              style={{ top: '82%', width: '280px', left: 0, animationDelay: '0.24s' }}
            />
          )}
        </>
      )}

      {/* Stealth Warplane Patrol */}
      <div style={css.airspaceOverlay}>
        <div className="anim-plane-fly" style={css.roamingBomberRig}>
          <svg width="68" height="68" viewBox="0 0 24 24" fill="#1c1917" stroke="#ef4444" strokeWidth="1.5">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <div style={css.planeStreamer}>
            <span style={{ color: '#fbbf24', fontWeight: '900' }}>⚡ AIR-DROP WARZONE:</span>
            <span style={{ color: '#ffffff' }}> WE ARE LIVIK WARRIORS! </span>
            <span style={{ color: '#f87171', fontWeight: 'bold' }}>🎂 SALUTE NATASHAAA! 🌸</span>
          </div>
        </div>
      </div>

      {/* Airborne Grenade */}
      {grenadeAirborne && (
        <div style={css.grenadeFlightLayer}>
          <div className="anim-grenade-fly" style={{ fontSize: '3.6rem', filter: 'drop-shadow(0 0 14px #f59e0b)' }}>
            💣
          </div>
        </div>
      )}

      {/* Fragrance Blast */}
      {grenadeBurst && (
        <div style={css.flowerBurstLayer}>
          <div style={css.shockwaveRing} />
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 360;
            const dist = 160 + (i % 6) * 38;
            const fx = `${Math.cos((angle * Math.PI) / 180) * dist}px`;
            const fy = `${Math.sin((angle * Math.PI) / 180) * dist}px`;
            const icons = ['🌸', '🌺', '🌹', '✨', '🎂', '💖', '💐'];
            return (
              <span
                key={i}
                style={{
                  ...css.burstFlowerItem,
                  '--fx': fx,
                  '--fy': fy,
                }}
              >
                {icons[i % icons.length]}
              </span>
            );
          })}
        </div>
      )}

      {/* Responsive HUD Header Bar */}
      <header style={css.hudHeader} className="hud-header-bar">
        <div style={css.hudLeft} className="hud-header-badge-full">
          <span style={css.hazardBadge}>⚠️ BGMI LIVIK // MIDSTEIN PROTOCOL</span>
          <span style={css.hudCoords}>GRID REF: 21:30 - 00:00 IST</span>
        </div>

        <div style={css.hudRight} className="hud-header-btn-full">
          <button onClick={handleThrowGrenade} style={css.grenadeActionBtn} className="hud-header-btn-full">
            💣 THROW FRAGRANCE GRENADE
          </button>
        </div>
      </header>

      {/* Celebratory Banner */}
      <div style={css.celebrationHeaderRibbon}>
        <span>🎂 HAPPY BIRTHDAY NATASHAAA! THE QUEEN OF COMBAT RESCUES 🌸</span>
      </div>

      {/* Hero Poster Showcase */}
      <section style={css.heroSection}>
        <div style={css.heroFrameWrapper} className="anim-blood-pulse">
          <div className="hero-split-layout" style={css.heroSplitLayout}>
            {/* Squad Poster Column */}
            <div className="hero-poster-column" style={css.posterColumn}>
              <div style={css.posterContainer}>
                <div style={css.crosshairScope}>
                  <div style={css.scopeH} />
                  <div style={css.scopeV} />
                  <span style={css.scopeCornerTL} />
                  <span style={css.scopeCornerTR} />
                  <span style={css.scopeCornerBL} />
                  <span style={css.scopeCornerBR} />
                </div>

                {/* Squad Photo Badges */}
                <div style={css.squadTagsOverlay}>
                  <div style={{ ...css.memberPhotoBadge, left: '6%', bottom: '26%', borderColor: '#f59e0b', color: '#f59e0b' }}>
                    #1 SULTHAN
                  </div>
                  <div style={{ ...css.memberPhotoBadge, left: '32%', top: '22%', borderColor: '#ef4444', color: '#fca5a5', backgroundColor: 'rgba(127, 29, 29, 0.9)' }}>
                    🎂 #2 NATASHAAA (MEDIC)
                  </div>
                  <div style={{ ...css.memberPhotoBadge, right: '30%', bottom: '28%', borderColor: '#a855f7', color: '#c084fc' }}>
                    #3 DRACULA
                  </div>
                  <div style={{ ...css.memberPhotoBadge, right: '6%', bottom: '22%', borderColor: '#3b82f6', color: '#60a5fa' }}>
                    #4 ACE SICARIO
                  </div>
                </div>

                <img
                  src={squadPoster.primary}
                  alt="Livik Squad Photo we.png"
                  onError={(e) => {
                    if (e.target.getAttribute('data-tried-fallback') !== 'true') {
                      e.target.setAttribute('data-tried-fallback', 'true');
                      e.target.src = squadPoster.fallback;
                    } else {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                  style={css.posterImage}
                />

                <div style={css.heroFallback}>
                  <span style={{ fontSize: '4.5rem' }}>🪖🩸</span>
                  <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 'bold', marginTop: '10px' }}>
                    [ we.png SQUAD PHOTO LOADING ]
                  </span>
                  <span style={{ fontSize: '11px', color: '#78716c' }}>
                    Verify: public/images/we.png
                  </span>
                </div>
              </div>
            </div>

            {/* Mission Dossier HUD */}
            <div style={css.dossierColumn}>
              <div style={css.dossierBadge}>CLASSIFIED DOSSIER // DECLASSIFIED</div>
              <h2 style={css.dossierTitle}>OPERATION MIDSTEIN DAWN</h2>

              <p style={css.dossierText}>
                The volcanic plumes of Livik shroud the blooming field in ash and gunpowder. Covered in clay and blood,
                our 4-warrior vanguard holds the line. When enemy fire rips through compound walls,
                our clutch Queen rushes through the smoke to deliver the revive!
              </p>

              <div style={css.dossierRosterList}>
                <div style={css.dossierMember}>
                  <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>#1 SULTHAN:</span>
                  <span style={{ color: '#a8a29e', fontSize: '12px' }}> Frontline Heavy Breacher (Far Left)</span>
                </div>
                <div style={css.dossierMember}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>#2 NATASHAAA:</span>
                  <span style={{ color: '#fca5a5', fontSize: '12px' }}> Combat Surgeon & Recall Specialist (Center)</span>
                </div>
                <div style={css.dossierMember}>
                  <span style={{ color: '#c084fc', fontWeight: 'bold' }}>#3 DRACULA:</span>
                  <span style={{ color: '#a8a29e', fontSize: '12px' }}> Reconnaissance Scout / UK Fog (Center Right)</span>
                </div>
                <div style={css.dossierMember}>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>#4 ACE SICARIO:</span>
                  <span style={{ color: '#a8a29e', fontSize: '12px' }}> Marksman & Perimeter Watch (Far Right)</span>
                </div>
              </div>

              <div style={css.dossierFooterTag}>
                <span>🎂 VIP OPERATIVE: <strong>NATASHAAA</strong></span>
                <span style={{ color: '#22c55e' }}>● STATUS: 100% REVIVE EFFICIENCY</span>
              </div>
            </div>
          </div>

          <div style={css.heroBannerBar}>
            <span style={{ color: '#ef4444', fontWeight: '900' }}>[ARCHIVE // we.png]</span>
            <span style={{ color: '#d6d3d1' }}>LIVIK BLOODY BATTLEFIELD PROTOCOL</span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>🎂 HAPPY BIRTHDAY NATASHAAA</span>
          </div>
        </div>
      </section>

      {/* Birthday Air-Drop Crate */}
      <section style={css.crateCentralSection}>
        <div className="anim-airdrop-bounce" onClick={handleOpenAirdrop} style={css.jumpingBoxCard}>
          <div style={css.jumpingBoxTopTag}>🚨 INCOMING BIRTHDAY AIR-DROP 🚨</div>
          <div style={{ fontSize: '4.8rem', margin: '4px 0' }}>🎁</div>
          <div style={css.touchCalloutText}>TOUCH TO OPEN AIRDROP!</div>
          <div style={css.touchSubtext}>PAUSES BG.MP3 & CRACKS BDAY ARCHIVE</div>
        </div>
      </section>

      {/* Primary Warzone Layout */}
      <main style={css.mainContainer}>
        {/* Claymore Detonation Banner */}
        <div style={css.fragSection}>
          {!isDetonated ? (
            <div style={css.liveFragBox}>
              <div style={css.fragAlert}>⚠️ LIVE CLAYMORE COOKING...</div>
              <div style={css.fragTimerRow}>
                <span style={{ fontSize: '3rem' }}>💣</span>
                <span style={css.timerNum}>0{timer}s</span>
              </div>
              <div style={css.cookTrack}>
                <div style={{ ...css.cookFill, width: `${(timer / 5) * 100}%` }} />
              </div>
              <div style={css.fragSub}>BRACE FOR SHRAPNEL & SALUTE DETONATION</div>
            </div>
          ) : (
            <div style={css.blastBox}>
              <div style={{ fontSize: '2.5rem' }}>💥 🩸 🎂 ⚔️ 🔥 🍰</div>
              <div style={css.blastTitle}>DETONATION IMPACT! HAPPY BIRTHDAY, NATASHAAA! 🎂</div>
              <div style={css.blastDesc}>
                The shell broke through enemy lines. Clay and bullet smoke yielded Level 3 Trauma Gear and endless revives!
              </div>
            </div>
          )}
        </div>

        <div style={css.warHeadingBlock}>
          <div style={css.threatLevel}>THREAT LEVEL: RED ZONE EXTREME</div>
          <h1 style={css.warTitle}>BLOOD & BULLETS: SALUTE TO NATASHAAA</h1>
          <p style={css.warLore}>
            Pushing through volcanic smoke and bloodied mud. While the squad holds the perimeter, our <strong>Recall Specialist</strong> braves crossfire to clutch every revive.
          </p>
        </div>

        {/* Squad Combat Roster */}
        <div style={css.rosterGrid}>
          {/* Sulthan */}
          <div style={{ ...css.soldierCard, borderTop: '4px solid #f59e0b' }}>
            <div style={css.cardStatusRow}>
              <span style={{ color: '#f59e0b', fontWeight: '900' }}>#01 CLAY BREACHER</span>
              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>📶 28ms</span>
            </div>

            <div style={css.tacticalInsigniaBox}>
              <div style={{ ...css.insigniaRing, borderColor: '#f59e0b' }}>
                <span style={{ fontSize: '2.5rem' }}>🪖</span>
              </div>
            </div>

            <h2 style={{ ...css.fighterName, color: '#f59e0b' }}>SULTHAN</h2>
            <div style={css.fighterRole}>Entry Assault & Fragger</div>
            <div style={css.fighterLoc}>📍 Kerala Frontline Division 🇮🇳</div>

            <div style={css.combatLog}>
              <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>TACTICAL: 7.62mm ASSAULT RIFLE</div>
              <div style={css.combatGear}>🎒 Gear: 2x Syringes, 4x Frag Grenades</div>
              <div style={css.combatQuote}>"Breaching main Midstein ruins. Keep Natasha covered!"</div>
            </div>

            <div style={{ ...css.soldierStatusBadge, color: '#86efac', borderColor: '#22c55e' }}>
              ● WEAPON HOT / ADVANCING
            </div>
          </div>

          {/* Natasha */}
          <div style={{ ...css.soldierCard, borderTop: '4px solid #dc2626' }} className="anim-blood-pulse">
            <div style={css.queenWarTag}>🩸 THE RECALL SPECIALIST 🩸</div>

            <div style={css.cardStatusRow}>
              <span style={{ color: '#f87171', fontWeight: '900', marginTop: '10px' }}>#02 FIELD SURGEON</span>
              <span style={{ color: '#f472b6', fontWeight: 'bold', marginTop: '10px' }}>📶 0ms (GOD MODE)</span>
            </div>

            <div style={css.tacticalInsigniaBox}>
              <div style={css.medicEmblemFrame}>
                <div style={css.medicCrossBarH} />
                <div style={css.medicCrossBarV} />
                <span style={css.medicCoreText}>MEDIC</span>
              </div>
            </div>

            <h2 style={{ ...css.fighterName, color: '#f87171' }}>NATASHAAA</h2>
            <div style={css.fighterRole}>Combat Revive Specialist & Anchor</div>
            <div style={css.fighterLoc}>📍 Safe Zone Fortress 🎂</div>

            <div style={{ ...css.combatLog, backgroundColor: 'rgba(69, 10, 10, 0.45)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <div style={{ color: '#f87171', fontWeight: 'bold' }}>TACTICAL: MARKSMAN SNIPER + SURGICAL RIG</div>
              <div style={css.combatGear}>🎒 Gear: ∞ Adrenaline Syringes, Med Kits & Recall Tokens</div>
              <div style={{ ...css.combatQuote, color: '#fecdd3' }}>
                "No soldier left behind in the clay. Pulling you back into the fight!"
              </div>
            </div>

            <button onClick={handleOpenAirdrop} style={css.openArchiveBtn}>
              🎁 OPEN NATASHA'S BDAY ARCHIVES (N1-N5)
            </button>
          </div>

          {/* Dracula */}
          <div style={{ ...css.soldierCard, borderTop: '4px solid #a855f7' }}>
            <div style={css.cardStatusRow}>
              <span style={{ color: '#c084fc', fontWeight: '900' }}>#03 GHOST OPERATIVE</span>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>📶 999ms ⚠️</span>
            </div>

            <div style={css.tacticalInsigniaBox}>
              <div style={{ ...css.insigniaRing, borderColor: '#a855f7', filter: draculaRevived ? 'none' : 'grayscale(80%)' }}>
                <span style={{ fontSize: '2.5rem' }}>🧛</span>
              </div>
            </div>

            <h2 style={{ ...css.fighterName, color: '#c084fc' }}>DRACULA</h2>
            <div style={css.fighterRole}>Recon Scout / UK Mist</div>
            <div style={css.fighterLoc}>📍 UK 🇬🇧 (5,000mi Blood Mist)</div>

            <div style={css.combatLog}>
              <div style={{ color: '#c084fc', fontWeight: 'bold' }}>TACTICAL: CQB CARBINE [CYCLING]</div>
              <div style={css.combatGear}>🎒 Gear: 0x Bandages (Lost in mud)</div>
              <div style={{ color: draculaRevived ? '#4ade80' : '#f87171', fontSize: '10px', marginTop: '4px' }}>
                {draculaRevived ? '✅ RECALLED BY NATASHA! AIRBORNE.' : '⚠️ FLATLINING IN STATIC...'}
              </div>
            </div>

            <div
              style={{
                ...css.soldierStatusBadge,
                color: draculaRevived ? '#86efac' : '#fca5a5',
                borderColor: draculaRevived ? '#22c55e' : '#ef4444',
              }}
            >
              {draculaRevived ? '● PARACHUTING BACK IN' : '● SIGNAL DROPPED'}
            </div>
          </div>

          {/* Ace Sicario */}
          <div style={{ ...css.soldierCard, borderTop: '4px solid #3b82f6' }}>
            <div style={css.cardStatusRow}>
              <span style={{ color: '#60a5fa', fontWeight: '900' }}>#04 SHADOW SNIPER</span>
              <span style={{ color: '#22c55e', fontWeight: 'bold' }}>📶 34ms</span>
            </div>

            <div style={css.tacticalInsigniaBox}>
              <div style={{ ...css.insigniaRing, borderColor: '#3b82f6' }}>
                <span style={{ fontSize: '2.5rem' }}>🎯</span>
              </div>
            </div>

            <h2 style={{ ...css.fighterName, color: '#60a5fa' }}>ACE SICARIO</h2>
            <div style={css.fighterRole}>Long-Range Cold Reaper</div>
            <div style={css.fighterLoc}>📍 Kerala High Ground 🇮🇳</div>

            <div style={css.combatLog}>
              <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>TACTICAL: 8x SCOPED BOLT-ACTION</div>
              <div style={css.combatGear}>🎒 Gear: 1x Med Kit, 2x Smoke Screens</div>
              <div style={css.combatQuote}>"Three rounds, three clean hits across the river. Sector cleared."</div>
            </div>

            <div style={{ ...css.soldierStatusBadge, color: '#93c5fd', borderColor: '#3b82f6' }}>
              ● SCOPE ZEROED / FIRING
            </div>
          </div>
        </div>

        {/* Midstein Recall Terminal */}
        <section style={css.towerCommandBox}>
          <div style={css.towerHeader}>MIDSTEIN EMERGENCY RECALL TERMINAL</div>
          <div style={css.towerDesc}>
            Dracula dropped connection in the UK fog. Natasha holds the activation codes!
          </div>

          <div style={css.towerActionRow}>
            <button
              onClick={triggerRecall}
              disabled={isRecalling || draculaRevived}
              style={{
                ...css.warfareBtn,
                backgroundColor: draculaRevived ? '#3b0764' : isRecalling ? '#b45309' : '#7f1d1d',
                borderColor: draculaRevived ? '#a855f7' : '#ef4444',
                cursor: draculaRevived ? 'not-allowed' : 'pointer',
              }}
            >
              {draculaRevived ? '📡 OPERATIVE RECALLED TO BATTLE!' : isRecalling ? `TRANSMITTING RECALL (${recallProgress}%)` : '🗼 ENGAGE RECALL BEACON'}
            </button>
          </div>

          {isRecalling && (
            <div style={css.recallTrack}>
              <div style={{ ...css.recallBar, width: `${recallProgress}%` }} />
            </div>
          )}
        </section>
      </main>

      {/* Birthday Vault Modal */}
      {isGiftModalOpen && (
        <div style={css.modalBackdrop} onClick={handleCloseModal}>
          <div
            className="anim-modal-in tactical-modal-frame"
            style={css.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti Particles */}
            <div key={blastKey} style={css.blastParticleWrapper}>
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * 360;
                const dist = 140 + (i % 6) * 30;
                const tx = `${Math.cos((angle * Math.PI) / 180) * dist}px`;
                const ty = `${Math.sin((angle * Math.PI) / 180) * dist}px`;
                return (
                  <span
                    key={i}
                    style={{
                      ...css.particleItem,
                      '--tx': tx,
                      '--ty': ty,
                      backgroundColor: ['#ef4444', '#f59e0b', '#f43f5e', '#fbbf24', '#e11d48'][i % 5],
                    }}
                  />
                );
              })}
            </div>

            {/* Modal Header */}
            <div style={css.modalHeader}>
              <div>
                <span style={css.modalTagline}>
                  🚨 AIR-DROP SECURED // CLASSIFIED VAULT (bday.mp3 ACTIVE) 🚨
                </span>
                <h2 style={css.modalTitle}>HAPPY BIRTHDAY, NATASHAAA! 🎂🌸</h2>
              </div>
              <button
                onClick={handleCloseModal}
                style={css.prominentCloseBtn}
                aria-label="Close modal and resume background ambient"
              >
                ✕
              </button>
            </div>

            {/* Photographic Showcase Display */}
            <div style={css.gallerySection}>
              <div className="tactical-photo-display" style={css.mainPhotoFrame}>
                <img
                  key={activePhotoIdx}
                  src={gallery[activePhotoIdx].src}
                  alt="Natasha Birthday Archive"
                  className="anim-fragrant-photo"
                  onError={(e) => {
                    if (e.target.getAttribute('data-tried') !== 'true') {
                      e.target.setAttribute('data-tried', 'true');
                      e.target.src = gallery[activePhotoIdx].fallback;
                    }
                  }}
                  style={css.activeDisplayImg}
                />

                <div style={css.photoBannerOverlay}>
                  <span>📸 {gallery[activePhotoIdx].title}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                    VAULT INTEL {activePhotoIdx + 1} / 5
                  </span>
                </div>
              </div>

              {/* Live Progression Tracker */}
              <div style={css.liveIndicatorStrip}>
                {gallery.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...css.indicatorSegment,
                      backgroundColor: activePhotoIdx === idx ? '#ef4444' : '#292524',
                      boxShadow: activePhotoIdx === idx ? '0 0 10px #ef4444' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Squad Congratulations Placards */}
            <div style={css.placardsGrid}>
              <div style={{ ...css.placardCard, borderLeft: '4px solid #f59e0b' }}>
                <div style={css.placardSender}>⚔️ TRANSMISSION: SULTHAN</div>
                <div style={css.placardBody}>
                  "Happy Birthday Natasha! While we hold down the frontline and breach compounds, you're the one holding our lives together. The squad is incomplete without our master reviver!"
                </div>
              </div>

              <div style={{ ...css.placardCard, borderLeft: '4px solid #a855f7' }}>
                <div style={css.placardSender}>🧛 TRANSMISSION: DRACULA</div>
                <div style={css.placardBody}>
                  "Happy Birthday! Even with 999ms ping from 5,000 miles away in the UK, your revives reach me every time. Thank you for never giving up on our team. Winner Winner Chicken Dinner!"
                </div>
              </div>

              <div style={{ ...css.placardCard, borderLeft: '4px solid #3b82f6' }}>
                <div style={css.placardSender}>🎯 TRANSMISSION: ACE SICARIO</div>
                <div style={css.placardBody}>
                  "Wishing you the happiest birthday, Natasha! Whenever I'm knocked on the far ridge, you sprint straight through enemy smoke to clutch the revive. Have an explosive birthday, our true Queen!"
                </div>
              </div>

              <div style={{ ...css.placardCard, borderLeft: '4px solid #ef4444' }}>
                <div style={css.placardSender}>🎂 BGMI LIVIK COMMAND // HEADQUARTERS</div>
                <div style={css.placardBody}>
                  "COMMAND NOTICE: Today the red zone is cleared and fireworks replace the artillery. A salute of 100 flare guns for Natashaaa's Birthday! Stay victorious!"
                </div>
              </div>
            </div>

            {/* Celebration Footnote */}
            <div style={css.modalFootnote}>
              <span>🎂 LEVEL 3 CHOCOLATE CAKE PACK DEPLOYED</span>
              <span>🌸 FLOWER BUFFER: 100% HEALTH</span>
              <span>❤️ FOREVER LIVIK SQUAD</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={css.warFooter}>
        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
          ⚔️ LIVIK SURVIVAL CONTRACT: WINNER WINNER CHICKEN DINNER GUARANTEED
        </div>
        <div>
          War Squad: <strong>Sulthan</strong>, <strong>Natasha</strong>, <strong>Dracula</strong> & <strong>Ace Sicario</strong>
        </div>
      </footer>
    </div>
  );
}

// Complete Responsive Stylesheet
const css = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#050507',
    backgroundImage: `
      radial-gradient(ellipse at 50% 0%, #1c0a0a 0%, #050507 80%),
      linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)
    `,
    backgroundSize: '100% 100%, 30px 30px, 30px 30px',
    color: '#e7e5e4',
    fontFamily: 'Courier New, ui-monospace, SFMono-Regular, monospace',
    position: 'relative',
    overflowX: 'hidden',
    paddingBottom: '40px',
  },
  lobbyGateOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(5, 5, 7, 0.94)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  lobbyGateCard: {
    backgroundColor: '#0d0909',
    border: '2px solid #ef4444',
    borderRadius: '12px',
    padding: '36px 28px',
    maxWidth: '560px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 0 50px rgba(220, 38, 38, 0.5)',
  },
  gateScopeFrame: {
    position: 'relative',
    width: '130px',
    height: '130px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #f59e0b',
    borderRadius: '50%',
    backgroundColor: 'rgba(28, 10, 10, 0.7)',
    marginBottom: '20px',
    boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)',
  },
  gateCrossH: {
    position: 'absolute',
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
  },
  gateCrossV: {
    position: 'absolute',
    height: '100%',
    width: '1px',
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
  },
  gateLogoTag: {
    color: '#f59e0b',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '3px',
    marginBottom: '6px',
  },
  gateTitle: {
    fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)',
    fontWeight: '900',
    color: '#fca5a5',
    margin: '0 0 8px 0',
    letterSpacing: '1.5px',
  },
  gateSubtitle: {
    fontSize: '11px',
    color: '#a8a29e',
    letterSpacing: '1px',
    margin: '0 0 16px 0',
  },
  gateRosterPreview: {
    display: 'flex',
    gap: '8px',
    fontSize: '11px',
    color: '#78716c',
    marginBottom: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  deployActionBtn: {
    backgroundColor: '#991b1b',
    border: '2px solid #ef4444',
    color: '#fef08a',
    padding: '16px 28px',
    fontSize: '14px',
    fontWeight: '900',
    letterSpacing: '2px',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 0 25px rgba(239, 68, 68, 0.7)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  gateAudioHint: {
    fontSize: '10px',
    color: '#78716c',
    marginTop: '16px',
    letterSpacing: '1px',
  },
  airspaceOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 60,
    overflow: 'hidden',
  },
  roamingBomberRig: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    filter: 'drop-shadow(0 0 15px #f59e0b)',
  },
  planeStreamer: {
    backgroundColor: '#7f1d1d',
    border: '1px solid #ef4444',
    padding: '4px 14px',
    borderRadius: '4px',
    fontSize: '11px',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
    boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
  },
  grenadeFlightLayer: {
    position: 'fixed',
    bottom: '80px',
    left: '20px',
    zIndex: 90,
    pointerEvents: 'none',
  },
  flowerBurstLayer: {
    position: 'fixed',
    top: '32%',
    left: '50%',
    zIndex: 95,
    pointerEvents: 'none',
  },
  shockwaveRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '4px solid #f43f5e',
    boxShadow: '0 0 35px #f43f5e, inset 0 0 25px #fda4af',
    animation: 'shockwaveRing 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
    pointerEvents: 'none',
  },
  burstFlowerItem: {
    position: 'absolute',
    fontSize: '2.4rem',
    animation: 'petalBloomScatter 2.4s cubic-bezier(0.12, 0.8, 0.28, 1) forwards',
  },
  hudHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: 'rgba(12, 10, 10, 0.95)',
    borderBottom: '2px solid rgba(185, 28, 28, 0.4)',
    backdropFilter: 'blur(8px)',
    gap: '12px',
    boxSizing: 'border-box',
  },
  hudLeft: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  hazardBadge: {
    backgroundColor: '#7f1d1d',
    color: '#fecaca',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '900',
    border: '1px solid #ef4444',
    letterSpacing: '1px',
  },
  hudCoords: { fontSize: '11px', color: '#78716c', letterSpacing: '1px' },
  hudRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  grenadeActionBtn: {
    backgroundColor: '#7f1d1d',
    border: '1px solid #ef4444',
    color: '#fef08a',
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: '900',
    cursor: 'pointer',
    letterSpacing: '1px',
    boxShadow: '0 0 14px rgba(239, 68, 68, 0.5)',
  },
  celebrationHeaderRibbon: {
    backgroundColor: '#991b1b',
    borderBottom: '1px solid #ef4444',
    color: '#fef08a',
    textAlign: 'center',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '900',
    letterSpacing: '1px',
  },

  heroSection: {
    maxWidth: '1180px',
    margin: '16px auto 10px auto',
    padding: '0 16px',
    position: 'relative',
    zIndex: 10,
  },
  heroFrameWrapper: {
    position: 'relative',
    backgroundColor: '#0c0a09',
    border: '2px solid #7f1d1d',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 40px rgba(127, 29, 29, 0.5)',
  },
  heroSplitLayout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#0a0808',
  },
  posterColumn: {
    flex: '1 1 50%',
    maxWidth: '520px',
    backgroundColor: '#050507',
    borderRight: '1px solid rgba(220, 38, 38, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '16px',
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid rgba(220, 38, 38, 0.4)',
    backgroundColor: '#0c0a09',
  },
  posterImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '680px',
    objectFit: 'contain',
    display: 'block',
  },
  squadTagsOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 8,
    pointerEvents: 'none',
  },
  memberPhotoBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(10, 8, 8, 0.88)',
    border: '1px solid',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '1px',
    boxShadow: '0 0 10px rgba(0,0,0,0.8)',
  },
  crosshairScope: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 5,
  },
  scopeH: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: '1px',
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
  },
  scopeV: {
    position: 'absolute',
    left: '50%',
    top: '5%',
    bottom: '5%',
    width: '1px',
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
  },
  scopeCornerTL: { position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #ef4444', borderLeft: '2px solid #ef4444' },
  scopeCornerTR: { position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid #ef4444', borderRight: '2px solid #ef4444' },
  scopeCornerBL: { position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid #ef4444', borderLeft: '2px solid #ef4444' },
  scopeCornerBR: { position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #ef4444', borderRight: '2px solid #ef4444' },
  heroFallback: {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 16px',
    textAlign: 'center',
  },
  dossierColumn: {
    flex: '1 1 50%',
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 12, 12, 0.9)',
  },
  dossierBadge: {
    color: '#ef4444',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '2px',
    marginBottom: '6px',
  },
  dossierTitle: {
    fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
    fontWeight: '900',
    color: '#fca5a5',
    letterSpacing: '1px',
    margin: '0 0 14px 0',
  },
  dossierText: {
    fontSize: '13px',
    color: '#a8a29e',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  dossierRosterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: 'rgba(10, 8, 8, 0.8)',
    border: '1px solid rgba(120, 113, 108, 0.25)',
    padding: '14px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  dossierMember: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dossierFooterTag: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#78716c',
    borderTop: '1px solid rgba(120, 113, 108, 0.2)',
    paddingTop: '12px',
    flexWrap: 'wrap',
    gap: '6px',
  },
  heroBannerBar: {
    backgroundColor: 'rgba(10, 8, 8, 0.95)',
    borderTop: '1px solid rgba(220, 38, 38, 0.4)',
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    flexWrap: 'wrap',
    gap: '8px',
  },

  crateCentralSection: {
    display: 'flex',
    justifyContent: 'center',
    margin: '28px 0 14px 0',
    position: 'relative',
    zIndex: 25,
  },
  jumpingBoxCard: {
    backgroundColor: 'rgba(38, 12, 12, 0.95)',
    border: '2px solid #ef4444',
    borderRadius: '10px',
    padding: '18px 32px',
    textAlign: 'center',
    boxShadow: '0 0 35px rgba(239, 68, 68, 0.5)',
    transition: 'all 0.2s',
  },
  jumpingBoxTopTag: {
    color: '#f59e0b',
    fontWeight: '900',
    fontSize: '11px',
    letterSpacing: '2px',
  },
  touchCalloutText: {
    color: '#fbbf24',
    fontWeight: '900',
    fontSize: '16px',
    letterSpacing: '1.5px',
  },
  touchSubtext: {
    color: '#cbd5e1',
    fontSize: '11px',
    marginTop: '4px',
  },

  mainContainer: {
    maxWidth: '1180px',
    margin: '20px auto',
    padding: '0 16px',
    position: 'relative',
    zIndex: 10,
  },
  fragSection: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
  liveFragBox: {
    backgroundColor: 'rgba(28, 12, 12, 0.85)',
    border: '2px solid #b91c1c',
    padding: '16px 28px',
    borderRadius: '6px',
    textAlign: 'center',
    maxWidth: '440px',
    width: '100%',
  },
  fragAlert: { color: '#ef4444', fontSize: '11px', fontWeight: '900', letterSpacing: '2px' },
  fragTimerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: '6px 0' },
  timerNum: {
    fontSize: '2.4rem',
    fontWeight: '900',
    color: '#ef4444',
    background: '#0c0a09',
    padding: '2px 14px',
    borderRadius: '4px',
    border: '1px solid #dc2626',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
  },
  cookTrack: { width: '100%', height: '6px', backgroundColor: '#292524', overflow: 'hidden', margin: '8px 0' },
  cookFill: { height: '100%', backgroundColor: '#ef4444', transition: 'width 1s linear' },
  fragSub: { color: '#78716c', fontSize: '10px' },
  blastBox: {
    backgroundColor: 'rgba(69, 10, 10, 0.7)',
    border: '2px solid #ef4444',
    padding: '20px 24px',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 0 35px rgba(220, 38, 38, 0.6)',
  },
  blastTitle: { fontSize: '1.25rem', fontWeight: '900', color: '#fca5a5', marginTop: '6px' },
  blastDesc: { fontSize: '12px', color: '#e7e5e4', marginTop: '6px', maxWidth: '640px', margin: '6px auto 0 auto' },

  warHeadingBlock: { textAlign: 'center', marginBottom: '32px' },
  threatLevel: { color: '#ef4444', fontSize: '11px', fontWeight: '900', letterSpacing: '3px', marginBottom: '6px' },
  warTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
    fontWeight: '900',
    letterSpacing: '2px',
    margin: '0 0 10px 0',
    background: 'linear-gradient(90deg, #ef4444, #f59e0b, #b91c1c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  warLore: { maxWidth: '740px', margin: '0 auto', fontSize: '13px', color: '#a8a29e', lineHeight: '1.7' },

  rosterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  soldierCard: {
    backgroundColor: 'rgba(18, 14, 14, 0.92)',
    border: '1px solid rgba(120, 113, 108, 0.25)',
    borderRadius: '6px',
    padding: '18px 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
  },
  queenWarTag: {
    position: 'absolute',
    top: '-12px',
    backgroundColor: '#b91c1c',
    color: '#fff',
    padding: '3px 12px',
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1px',
    border: '1px solid #ef4444',
  },
  cardStatusRow: { width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' },
  tacticalInsigniaBox: { margin: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  insigniaRing: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '2px solid',
    backgroundColor: '#0c0a09',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(0,0,0,0.8)',
  },
  fighterName: { margin: '6px 0 2px 0', fontSize: '18px', fontWeight: '900', letterSpacing: '1.5px' },
  fighterRole: { fontSize: '11px', color: '#d6d3d1', marginBottom: '4px' },
  fighterLoc: { fontSize: '10px', color: '#78716c', marginBottom: '12px' },
  combatLog: {
    width: '100%',
    backgroundColor: 'rgba(10, 8, 8, 0.85)',
    border: '1px solid rgba(120, 113, 108, 0.2)',
    padding: '8px 10px',
    fontSize: '11px',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  combatGear: { fontSize: '10px', color: '#a8a29e', marginTop: '3px' },
  combatQuote: { fontSize: '10px', color: '#78716c', fontStyle: 'italic', marginTop: '4px' },
  soldierStatusBadge: {
    fontSize: '9px',
    fontWeight: 'bold',
    padding: '4px 10px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '1px solid',
    letterSpacing: '1px',
  },

  medicEmblemFrame: {
    width: '85px',
    height: '85px',
    borderRadius: '6px',
    backgroundColor: '#1c0a0a',
    border: '2px solid #ef4444',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)',
  },
  medicCrossBarH: { position: 'absolute', width: '70%', height: '18px', backgroundColor: '#b91c1c' },
  medicCrossBarV: { position: 'absolute', height: '70%', width: '18px', backgroundColor: '#b91c1c' },
  medicCoreText: { position: 'relative', zIndex: 2, color: '#ffffff', fontSize: '10px', fontWeight: '900', letterSpacing: '1px' },
  openArchiveBtn: {
    width: '100%',
    backgroundColor: '#991b1b',
    border: '1px solid #ef4444',
    color: '#fff',
    padding: '9px 10px',
    fontSize: '10px',
    fontWeight: '900',
    cursor: 'pointer',
    letterSpacing: '1px',
    marginTop: '6px',
  },

  towerCommandBox: {
    backgroundColor: 'rgba(15, 12, 12, 0.85)',
    border: '1px solid rgba(185, 28, 28, 0.35)',
    padding: '22px',
    textAlign: 'center',
    borderRadius: '6px',
    maxWidth: '680px',
    margin: '0 auto',
  },
  towerHeader: { color: '#ef4444', fontSize: '13px', fontWeight: '900', letterSpacing: '2px' },
  towerDesc: { fontSize: '11px', color: '#a8a29e', margin: '4px 0 16px 0' },
  towerActionRow: { display: 'flex', justifyContent: 'center' },
  warfareBtn: {
    border: '1px solid',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '11px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    transition: 'all 0.2s',
  },
  recallTrack: { width: '100%', height: '6px', backgroundColor: '#1c1917', marginTop: '16px', overflow: 'hidden' },
  recallBar: { height: '100%', backgroundColor: '#ef4444', transition: 'width 0.25s linear' },

  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    backdropFilter: 'blur(10px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    overflowY: 'auto',
  },
  modalContainer: {
    backgroundColor: '#0c0a09',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    maxWidth: '820px',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '24px',
    position: 'relative',
    boxShadow: '0 0 60px rgba(239, 68, 68, 0.6)',
  },
  blastParticleWrapper: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    pointerEvents: 'none',
    zIndex: 2,
  },
  particleItem: {
    position: 'absolute',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    animation: 'blastParticleBurst 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
    pointerEvents: 'none',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(239, 68, 68, 0.4)',
    paddingBottom: '12px',
    marginBottom: '16px',
    gap: '12px',
  },
  modalTagline: {
    color: '#ef4444',
    fontWeight: '900',
    fontSize: '11px',
    letterSpacing: '2px',
  },
  modalTitle: {
    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
    fontWeight: '900',
    color: '#fca5a5',
    margin: '4px 0 0 0',
  },
  prominentCloseBtn: {
    width: '48px',
    height: '48px',
    backgroundColor: '#7f1d1d',
    border: '2px solid #ef4444',
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: '900',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    boxShadow: '0 0 16px rgba(239, 68, 68, 0.7)',
  },
  gallerySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  mainPhotoFrame: {
    position: 'relative',
    maxWidth: '460px',
    width: '100%',
    height: '380px',
    backgroundColor: '#171212',
    border: '2px solid #ef4444',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDisplayImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    zIndex: 3,
  },
  photoBannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 8, 8, 0.92)',
    borderTop: '1px solid rgba(239, 68, 68, 0.4)',
    padding: '8px 12px',
    fontSize: '11px',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 7,
  },
  liveIndicatorStrip: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  indicatorSegment: {
    width: '28px',
    height: '4px',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  placardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  placardCard: {
    backgroundColor: 'rgba(22, 16, 16, 0.85)',
    border: '1px solid rgba(120, 113, 108, 0.25)',
    padding: '12px',
    borderRadius: '4px',
  },
  placardSender: {
    fontSize: '11px',
    fontWeight: '900',
    color: '#fca5a5',
    marginBottom: '4px',
  },
  placardBody: {
    fontSize: '11px',
    color: '#d6d3d1',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },
  modalFootnote: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: '#a8a29e',
    borderTop: '1px solid rgba(239, 68, 68, 0.3)',
    paddingTop: '12px',
    flexWrap: 'wrap',
    gap: '8px',
  },

  warFooter: {
    borderTop: '2px solid rgba(127, 29, 29, 0.4)',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: '#78716c',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '36px',
  },
};