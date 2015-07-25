var models = require('../models/model.js');

exports.load = function(req,res,next,quizId){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		}else{
			next(new Error('No existe quizId = '+quizId));
		}
	}).catch(function(error){next(error);});
};

exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: req.quiz});
	})
};

exports.question = function(req,res){
models.Quiz.findAll().success(function(quiz){
	res.render('quizes/question',{pregunta:quiz[0].pregunta})
})

};

exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}

	res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado});
};

exports.index = function(req,res){
	var busqueda='';

	if(req.query.search)
	{
		busqueda='%'+req.query.search+'%';
		busqueda=busqueda.replace(" ","%");

		models.Quiz.findAll({where:["pregunta like ?",busqueda]}).then(function(quizes){
			res.render('quizes/index',{quizes:quizes});
		})
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index',{quizes:quizes});
		})
	}
};


exports.new = function(req,res){
	var quiz = models.Quiz.build({pregunta:"Pregunta",respuesta:"Respuesta"});

	res.render('quizes/new',{quiz:quiz});
};

exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.save({fields:["pregunta","respuesta"]}).then(function(){
		res.redirect('/quizes');
	})
};