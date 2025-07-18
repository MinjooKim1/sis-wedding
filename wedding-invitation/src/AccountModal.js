// AccountModal.js
import React from 'react';

const AccountModal = ({ title, accounts, onClose, isKorean = true }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(isKorean ? "복사되었습니다!" : "Copied!");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        {accounts.map((acc, i) => (
          <div key={i} style={styles.row}>
            <div>
              <div><strong>{acc.bank}</strong></div>
              <div>{isKorean ? "예금주" : "Account Holder"}: {acc.holder}</div>
            </div>
            <div style={styles.copyBox}>
              <span style={styles.accountNum}>{acc.number}</span>
              <button onClick={() => copyToClipboard(acc.number)} style={styles.copyBtn}>
                {isKorean ? "복사" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountModal;

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px",
  },
  closeBtn: {
    fontSize: "24px", border: "none", background: "none", cursor: "pointer",
  },
  row: {
    borderTop: "1px solid #eee",
    padding: "10px 0",
  },
  copyBox: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px",
  },
  accountNum: {
    fontWeight: "bold",
  },
  copyBtn: {
    marginLeft: "10px",
    padding: "5px 10px",
    backgroundColor: "#4db6ac",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};