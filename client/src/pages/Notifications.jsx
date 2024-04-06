import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/notification.css";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import "../styles/user.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 8;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/notification/getallnotifs?page=${currentPage - 1}&limit=${notificationsPerPage}`);
      dispatch(setLoading(false));
      setNotifications(temp);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    getAllNotif();
  }, [currentPage]);

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)}>{i}</button>
      );
    }
    return pages;
  };

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Notifications</h2>

          {notifications.length > 0 ? (
            <div className="notifications">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Content</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNotifications.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{(currentPage - 1) * notificationsPerPage + i + 1}</td>
                      <td>{ele?.content}</td>
                      <td>{ele?.updatedAt.split("T")[0]}</td>
                      <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">{renderPagination()}</div>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
      <Footer />
    </>
  );
};

export default Notifications;
