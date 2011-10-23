package yakit.clientservlet;

import java.io.IOException;
//import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import kdseg.ds.KDSegDataStructure;
import yakradio.FactoryManager;
import yakradio.JSONInvocationEngine;

/**
 * Servlet implementation class YakitClientServlet
 */
public class YakitClientServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public YakitClientServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*
		 * Initialize Yakit Radio
		 */
		//System.out.println("Recieved Yakit client Request "+request.getQueryString());
		JSONInvocationEngine jsonEngine = (JSONInvocationEngine) this.getServletContext().getAttribute("jsonengine");
		//Enumeration servlets = this.getServletContext().getAttributeNames();
		if(jsonEngine==null){
			//System.out.println("Hopefully won't happen");
			jsonEngine = new JSONInvocationEngine();
			this.getServletContext().setAttribute("jsonengine", jsonEngine);
		}
		
		KDSegDataStructure structure = (KDSegDataStructure) this.getServletContext().getAttribute("kddatastructure");
		if(structure==null){
			//System.out.println("Hopefully won't happen again");
			structure = KDSegDataStructure.getInstance();
			this.getServletContext().setAttribute("kddatastructure", structure);
		}
		
		FactoryManager factoryManager = (FactoryManager) this.getServletContext().getAttribute("factorymanager");
		if(factoryManager==null){
			factoryManager = FactoryManager.getInstance();
			factoryManager.initialize(structure);
			this.getServletContext().setAttribute("factorymanager", factoryManager);
		}
		jsonEngine.initialize(structure,factoryManager);//you can do this as many times as you want as long as struct and factory are the same
		//Done initializing
		String jsonMessage = request.getParameter("jsonmessage");
		String jsonReturnMessage = jsonEngine.handleMessage(jsonMessage);
		response.setContentType("text");
		response.getWriter().print(jsonReturnMessage);
		response.getWriter().close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
