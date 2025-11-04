import React from "react";
// import { Link } from "react-router-dom";
import Link from "next/link";
import { HomeOutlined, UserOutlined, WalletFilled } from "@ant-design/icons";
import Image from "next/image";
import GameHistoryIcon from "../../Assets/layout/game.svg";
import ReferIcon from "../../Assets/layout/refer.svg";
import WinCashIcon from "../../Assets/layout/win_cash.svg";

export const UserFooterBar = () => {
  return (
    <>
      <div className="footer_list">
        <Link href={"/profile"}>
          <div className="profile_icon icon_zindex">
            <UserOutlined />

            <p className="title_name">Profile</p>
          </div>
        </Link>
        <Link href={"/wallet"}>
          <div className="profile_icon icon_zindex">
            <WalletFilled />
            <p className="title_name">Wallet</p>
          </div>
        </Link>

        <div className="game_btn_main">
          <Link href={"/"}>
            <div className="profile_icon profile_btn_box">
              <button className="profile_game_btn">
                {/* <Image src={HomeOutlined} alt="profile" height={24} /> */}
                <HomeOutlined />
              </button>
            </div>
          </Link>
        </div>

        <Link href={"/Gamehistory"}>
          <div className="profile_icon profile_icon_margin_left icon_zindex">
            <Image src={GameHistoryIcon} alt="profile" height={14} />
            <p className="title_name">History</p>
          </div>
        </Link>
        <Link href={"/refer-earn"}>
          <div className="profile_icon icon_zindex">
            <Image src={ReferIcon} alt="profile" height={14} />

            <p className="title_name">Refer</p>
          </div>
        </Link>
      </div>
    </>
  );
};
