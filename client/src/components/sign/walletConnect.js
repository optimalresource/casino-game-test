import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { translate } from "../../translations/translate";
import {
  connectWallet,
  disconnectWallet,
  getNetworkName,
  saveWalletData,
  setupWalletListeners,
} from "../../utils/wallet";
import {
  connectWallet as connectWalletAction,
  disconnectWallet as disconnectWalletAction,
  updateWalletAddress,
  updateWalletChain,
} from "../../reducers/auth";
import { Button, Alert, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

function WalletConnect(props) {
  const { lang, onWalletConnected, socket } = props;
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.auth.wallet);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setupWalletListeners(
      (newAddress) => {
        dispatch(updateWalletAddress(newAddress));
      },
      (newChainId) => {
        dispatch(updateWalletChain(newChainId));
      },
      () => {
        dispatch(disconnectWalletAction());
        setSuccess(false);
        setError(null);
      }
    );

    if (socket) {
      socket.on("wallet_verify_response", handleWalletVerificationResponse);
    }

    return () => {
      if (socket) {
        socket.off("wallet_verify_response", handleWalletVerificationResponse);
      }
    };
  }, [dispatch, socket]);

  const handleWalletVerificationResponse = (response) => {
    setIsVerifying(false);

    if (response.success) {
      setSuccess(true);

      if (onWalletConnected && typeof onWalletConnected === "function") {
        setTimeout(() => {
          onWalletConnected(response.walletInfo);
        }, 1000);
      }
    } else {
      setError(response.error || "Wallet verification failed");
      disconnectWallet();
      dispatch(disconnectWalletAction());
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await connectWallet();

      if (result.success) {
        saveWalletData(result);

        dispatch(connectWalletAction(result));

        setIsVerifying(true);
        if (socket) {
          socket.emit("wallet_verify", {
            walletAddress: result.account,
            chainId: result.chainId,
            provider: result.provider,
          });
        } else {
          setSuccess(true);
          if (onWalletConnected && typeof onWalletConnected === "function") {
            setTimeout(() => {
              onWalletConnected(result);
            }, 1000);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    dispatch(disconnectWalletAction());
    setSuccess(false);
    setError(null);
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet_connect_container">
      <div className="wallet_connect_box">
        <div className="wallet_connect_header">
          <FontAwesomeIcon icon={faWallet} className="wallet_icon" />
          <h3>{translate({ lang: lang, info: "connect_wallet_title" })}</h3>
          <p>{translate({ lang: lang, info: "connect_wallet_description" })}</p>
        </div>

        {error && (
          <Alert variant="danger" className="wallet_error">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{error}</span>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="wallet_success">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>
              {translate({ lang: lang, info: "wallet_connected_success" })}
            </span>
          </Alert>
        )}

        {wallet.isConnected ? (
          <div className="wallet_info">
            <div className="wallet_address">
              <strong>
                {translate({ lang: lang, info: "wallet_address" })}:
              </strong>
              <span>{formatAddress(wallet.address)}</span>
            </div>
            <div className="wallet_network">
              <strong>{translate({ lang: lang, info: "network" })}:</strong>
              <span>{getNetworkName(wallet.chainId)}</span>
            </div>
            <div className="wallet_provider">
              <strong>{translate({ lang: lang, info: "provider" })}:</strong>
              <span>{wallet.provider}</span>
            </div>

            <div className="wallet_actions">
              <Button
                variant="outline-danger"
                onClick={handleDisconnectWallet}
                className="disconnect_button"
              >
                {translate({ lang: lang, info: "disconnect_wallet" })}
              </Button>
            </div>
          </div>
        ) : (
          <div className="wallet_connect_actions">
            <Button
              variant="primary"
              onClick={handleConnectWallet}
              disabled={isConnecting || isVerifying}
              className="connect_button"
              size="lg"
            >
              {isConnecting || isVerifying ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {isVerifying
                    ? translate({ lang: lang, info: "verifying_wallet" })
                    : translate({ lang: lang, info: "connecting_wallet" })}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faWallet} className="me-2" />
                  {translate({ lang: lang, info: "connect_metamask" })}
                </>
              )}
            </Button>

            <div className="wallet_requirements">
              <p className="text-muted">
                {translate({ lang: lang, info: "wallet_requirements" })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletConnect;
