<%@page import="com.innorix.transfer.InnorixTransfer"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.innorix.transfer.InnorixUpload" %>
<%@ page import="java.util.*" %>

<%
// CORS체크를 위한 OPTIONS 메소드가 들어오므로 POST 일 경우에만 동작하도록 조건 추가

if ("POST".equals(request.getMethod()))
{
	String directory = InnorixUpload.getServletAbsolutePath(request);
	directory = directory.substring(0, directory.lastIndexOf("/") + 1) + "data";
	int maxPostSize = 2147482624; // bytes

	InnorixUpload uploader = new InnorixUpload(request, response, maxPostSize, directory);
	/*
		전달되는 _action Param 정보
			speedCheck          : 전송속도 측정
			getServerInfo       : 서버정보 확인
			getFileInfo         : 파일정보 확인
			attachFile          : 파일전송 진행
			attachFileCompleted : 파일전송 완료
	*/
	
	String _action          = uploader.getParameter("_action");         // 동작 플래그
	String _orig_filename   = uploader.getParameter("_orig_filename");  // 원본 파일명
	String _new_filename    = uploader.getParameter("_new_filename");   // 저장 파일명
	String _filesize        = uploader.getParameter("_filesize");       // 파일 사이즈
	String _start_offset    = uploader.getParameter("_start_offset");   // 파일저장 시작지점
	String _end_offset      = uploader.getParameter("_end_offset");     // 파일저장 종료지점
	String _filepath        = uploader.getParameter("_filepath");       // 파일 저장경로
	String _el              = uploader.getParameter("el");              // 컨트롤 엘리먼트 ID
	String _transferId		= uploader.getParameter("_transferId");		// TransferId
	String _unique_filename		= uploader.getParameter("_unique_filename");		// uniqueName
	String _folder		= uploader.getParameter("_folder");		// folder
	
	/* 파일정보 확인 */
	if("getFileInfo".equals(_action)) {
		String filePath = directory + "/";
		
		if(_folder.length() > 0){ //폴더가 존재할 경우
			filePath += _folder.replace("\\", "/") + "/";	
		}
		
		filePath += _orig_filename;
		String uniqueId = _unique_filename.replace(".irx", "").replace(".dat", ""); //Agent: irx / HTML5: dat
		
		uploader.setCustomValue("uniqueId", uniqueId); //취소, 완료 시 uniqueId 취득용
		uploader.sendCustomValue();
		session.setAttribute(uniqueId, filePath); // 세션 저장
	
	}
	
	String _run_retval = uploader.run();
	
	/* 개별 파일 전송 완료 후 처리 */
	if("attachFileCompleted".equals(_action)) {
		
	}

	System.out.println("========== innorix transfer " + System.currentTimeMillis() + " ==========");
	System.out.println("_action \t = " + _action);
	System.out.println("_run_retval \t = " + _run_retval);
	System.out.println("_orig_filename \t = " + _orig_filename);
	System.out.println("_new_filename \t = " + _new_filename);
	System.out.println("_filesize \t = " + _filesize);
	System.out.println("_start_offset \t = " + _start_offset);
	System.out.println("_end_offset \t = " + _end_offset);
	System.out.println("_filepath \t = " + _filepath);
	System.out.println("_el \t = " + _el);
	

}

// CORS 관련 헤더 추가
response.setHeader("Access-Control-Allow-Origin", "*");
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type");
%>