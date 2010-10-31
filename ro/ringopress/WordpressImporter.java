package ro.ringopress;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import ro.jlin.net.BrowserLocationer;
import ro.jlin.util.string.Util;

/**
 *
 * @author root
 */
public class WordpressImporter {

    static String sessionCookie = null;

    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(WordpressImporter.class.getName()).log(Level.SEVERE, null, ex);
        }
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1/bash?" + "user=root&password=&dumpQueriesOnException=true&characterEncoding=UTF-8");

            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery("select post_title,post_content,post_date,ID from b2_netposts where post_status='publish'");
            while (rs.next()) {
                String postTitle = rs.getString("post_title");
                String postContent = rs.getString("post_content");
                postContent = postContent.replaceAll("\r", "");
                postContent = postContent.replaceAll("\n{1,2}", "<br/>");
                Timestamp postDate = rs.getTimestamp("post_date");
                Integer postId = rs.getInt("ID");
                postData("post=true&title=" + URLEncoder.encode(postTitle,"UTF-8") + "&text=" + URLEncoder.encode(postContent,"UTF-8") + "&creationDate=" + postDate.getTime());
                Statement stComment = conn.createStatement();
                ResultSet rsComment = stComment.executeQuery("select comment_author,comment_author_email,comment_date,comment_author_url,comment_content from b2_netcomments where comment_approved = 1 and comment_post_ID = " + postId);
                while (rsComment.next()) {
                    String author = rsComment.getString("comment_author");
                    String authorEmail = rsComment.getString("comment_author_email");
                    String authorURL = rsComment.getString("comment_author_url");
                    String comment = rsComment.getString("comment_content");
                    Timestamp t1 = rsComment.getTimestamp("comment_date");
                    postData("comment"+"="+URLEncoder.encode(comment,"UTF-8")+"&author"+"=" + URLEncoder.encode(author,"UTF-8") + "&email"+"=" + URLEncoder.encode(authorEmail,"UTF-8") + "&website"+"=" + URLEncoder.encode(authorURL,"UTF-8") + "&creationDate"+"=" + t1.getTime());
                }
                rsComment.close();
                stComment.close();
            }
            rs.close();
            st.close();
        } catch (SQLException sqle) {
            Logger.getLogger(WordpressImporter.class.getName()).log(Level.SEVERE, null, sqle);
            System.out.println(sqle.getMessage());
        } catch(UnsupportedEncodingException uee){
            uee.printStackTrace();
        }

    }

    public static void postData(String data) {
        BrowserLocationer browser = new BrowserLocationer();
        browser.setConnectionFromURL("http://jajabash.jlin.ro/importPosts");
        browser.setContentType("application/x-www-form-urlencoded");
        if(sessionCookie!=null){
            browser.setCookieHeader(sessionCookie);
        }
        browser.actionPost(data, 390);
        String cookie = browser.getCookieHeader();
        if(sessionCookie==null){
            sessionCookie = cookie;
        }
        browser.close();
    }
}
