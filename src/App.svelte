<script>
  import { onMount } from "svelte";
  import { authWithSuperQi } from "./services/api.js";

  // Existing Auth and Payment Logic
  let token = "";
  let selectedMatch = null;
  let isBooking = false;

  const matches = [
    {
      id: 1,
      home: "الزوراء",
      away: "القوة الجوية",
      stadium: "ملعب المدينة الدولي",
      time: "19:00",
      date: "2024-02-15",
      price: "15,000 د.ع",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400",
      logoHome: "🦅",
      logoAway: "✈️",
    },
    {
      id: 2,
      home: "الشرطة",
      away: "الطلبة",
      stadium: "ملعب الشعب الدولي",
      time: "17:30",
      date: "2024-02-16",
      price: "10,000 د.ع",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400",
      logoHome: "🛡️",
      logoAway: "🎓",
    },
    {
      id: 3,
      home: "الميناء",
      away: "أربيل",
      stadium: "ملعب الميناء الأولمبي",
      time: "20:00",
      date: "2024-02-17",
      price: "12,000 د.ع",
      image:
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=400",
      logoHome: "⚓",
      logoAway: "🏰",
    },
  ];

  function getAuthCode() {
    if (typeof my !== "undefined") {
      if (typeof my.getAuthCode === "function") {
        my.getAuthCode({
          scopes: ["auth_base", "USER_ID"],
          success: async (res) => {
            try {
              const data = await authWithSuperQi(res.authCode);
              token = data.token;
              my.alert({
                content: "تم تسجيل الدخول بنجاح",
              });
            } catch (error) {
              console.error("Auth error:", error);
            }
          },
          fail: (res) => {
            console.error("getAuthCode fail:", res);
            const errorStr = JSON.stringify(res);
            // Ignore errors related to the function not being found/supported
            if (
              errorStr.includes("not found") ||
              errorStr.includes("not implemented")
            ) {
              console.warn("getAuthCode not supported in this environment");
            } else {
              my.alert({
                content: "فشل الحصول على رمز الدخول: " + errorStr,
              });
            }
          },
        });
      } else {
        console.warn("my.getAuthCode is not defined in this environment");
      }
    } else {
      console.warn("Global 'my' object not found.");
      if (!token) token = "dummy-token-for-preview";
    }
  }

  function handlePayment() {
    if (!token) {
      getAuthCode();
      return;
    }

    if (typeof my !== "undefined") {
      fetch("https://its.mouamle.space/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          my.tradePay({
            paymentUrl: data.url,
            success: (res) => {
              my.alert({
                content: "تمت عملية الشراء بنجاح! استمتع بالمباراة",
              });
              isBooking = false;
            },
            fail: (res) => {
              my.alert({
                content: "فشل الدفع: " + JSON.stringify(res),
              });
            },
          });
        })
        .catch((err) => {
          my.alert({
            content: "خطأ في الاتصال بالسيرفر",
          });
        });
    } else {
      alert("عذراً، عملية الدفع متاحة فقط داخل تطبيق سوبر أب");
    }
  }

  function selectMatch(match) {
    selectedMatch = match;
    isBooking = true;
  }

  onMount(() => {
    const timer = setTimeout(() => {
      if (typeof my !== "undefined") {
        getAuthCode();
      }
    }, 500);
    return () => clearTimeout(timer);
  });
</script>

<main class="container">
  <header class="header animate-fade-in">
    <div class="logo-section">
      <div class="ipl-logo">IQ</div>
      <h1>تذاكر الدوري العراقي الممتاز</h1>
    </div>
    <div class="user-status">
      {#if token}
        <span class="status-badge connected">متصل</span>
      {:else}
        <button class="login-mini-btn" on:click={getAuthCode}
          >تسجيل الدخول</button
        >
      {/if}
    </div>
  </header>

  <section class="hero glass-morphism animate-slide-up">
    <h2>احجز مقعدك الآن</h2>
    <p>لا تفوت إثارة الدوري العراقي، أفضل المقاعد بانتظارك.</p>
  </section>

  <div class="matches-grid">
    {#each matches as match}
      <div
        class="match-card glass-morphism animate-slide-up"
        style="animation-delay: {match.id * 0.1}s"
      >
        <div class="match-header">
          <span class="match-date">{match.date} | {match.time}</span>
        </div>
        <div class="teams">
          <div class="team">
            <span class="team-logo">{match.logoHome}</span>
            <span class="team-name">{match.home}</span>
          </div>
          <div class="vs">VS</div>
          <div class="team">
            <span class="team-logo">{match.logoAway}</span>
            <span class="team-name">{match.away}</span>
          </div>
        </div>
        <div class="stadium">📍 {match.stadium}</div>
        <div class="match-footer">
          <span class="price">{match.price}</span>
          <button class="book-btn" on:click={() => selectMatch(match)}
            >حجز تذكرة</button
          >
        </div>
      </div>
    {/each}
  </div>

  {#if isBooking}
    <div class="modal-overlay" on:click={() => (isBooking = false)}>
      <div class="modal glass-morphism" on:click|stopPropagation>
        <h2>تأكيد الحجز</h2>
        <div class="selected-details">
          <p>
            <strong>المباراة:</strong>
            {selectedMatch.home} ضد {selectedMatch.away}
          </p>
          <p><strong>الملعب:</strong> {selectedMatch.stadium}</p>
          <p><strong>الوقت:</strong> {selectedMatch.time}</p>
          <hr />
          <div class="total">
            <span>الإجمالي:</span>
            <span>{selectedMatch.price}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="pay-confirm-btn" on:click={handlePayment}>
            {#if !token}
              تسجيل الدخول والدفع
            {:else}
              تأكيد الدفع
            {/if}
          </button>
          <button class="cancel-btn" on:click={() => (isBooking = false)}
            >إلغاء</button
          >
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 0;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .ipl-logo {
    background: linear-gradient(
      135deg,
      var(--primary-color),
      var(--secondary-color)
    );
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    color: var(--bg-dark);
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 168, 107, 0.3);
  }

  h1 {
    font-size: 1.4rem;
    font-weight: 800;
  }

  .status-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(0, 168, 107, 0.2);
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .login-mini-btn {
    padding: 6px 14px;
    border-radius: 20px;
    background: var(--secondary-color);
    color: var(--bg-dark);
    font-weight: 700;
    font-size: 0.8rem;
  }

  .hero {
    padding: 40px;
    text-align: center;
    margin-bottom: 40px;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.01)
    );
  }

  .hero h2 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: var(--secondary-color);
  }

  .hero p {
    color: var(--text-muted);
  }

  .matches-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 50px;
  }

  .match-card {
    padding: 24px;
    transition: transform 0.3s ease;
  }

  .match-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
  }

  .match-header {
    margin-bottom: 15px;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .teams {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .team-logo {
    font-size: 2.5rem;
  }

  .team-name {
    font-weight: 700;
    font-size: 1.1rem;
  }

  .vs {
    background: var(--secondary-color);
    color: var(--bg-dark);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.8rem;
    margin: 0 20px;
  }

  .stadium {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 20px;
    text-align: center;
  }

  .match-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid var(--glass-border);
  }

  .price {
    font-weight: 800;
    font-size: 1.2rem;
    color: var(--primary-color);
  }

  .book-btn {
    padding: 10px 24px;
    background: var(--primary-color);
    color: white;
    border-radius: 10px;
    font-weight: 700;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .modal {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    text-align: right;
  }

  .modal h2 {
    margin-bottom: 20px;
    color: var(--secondary-color);
  }

  .selected-details {
    margin-bottom: 30px;
  }

  .selected-details p {
    margin-bottom: 10px;
    font-size: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--glass-border);
    margin: 20px 0;
  }

  .total {
    display: flex;
    justify-content: space-between;
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--primary-color);
  }

  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pay-confirm-btn {
    background: var(--primary-color);
    color: white;
    padding: 14px;
    border-radius: 12px;
    font-weight: 800;
    font-size: 1.1rem;
  }

  .cancel-btn {
    background: transparent;
    color: var(--text-muted);
    padding: 10px;
  }

  /* Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-slide-up {
    animation: fadeInUp 0.6s ease forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease forwards;
  }

  @media (max-width: 480px) {
    .match-card {
      padding: 20px;
    }
    .team-logo {
      font-size: 2rem;
    }
    .team-name {
      font-size: 0.9rem;
    }
  }
</style>
